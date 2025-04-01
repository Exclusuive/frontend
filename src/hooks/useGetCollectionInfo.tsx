import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiObjectResponse } from "@mysten/sui/client";

export const useCollectionDetail = (collectionId: string) => {
  const [result, setResult] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const suiClient = useSuiClient();

  const { data, isPending, error } = useSuiClientQuery("getDynamicFields", {
    parentId: collectionId,
  });

  useEffect(() => {
    const fetchCollectionInfo = async () => {
      if (!data || isPending || error) return;

      const objectIds = data.data.map((item) => item.objectId);
      const objects = [collectionId, ...objectIds];

      try {
        const res: SuiObjectResponse[] = await suiClient.multiGetObjects({
          ids: objects,
          options: {
            showContent: true,
          },
        });

        const content = res[0].data?.content as any;

        console.log(content);
        const itemsByLayer = (content?.fields?.item_types?.fields?.contents ?? []).reduce(
          (acc: Record<string, { type: string; img_url: string }[]>, entry: any) => {
            const valueFields = entry.fields.value.fields;

            const type = valueFields.type; // "pppl"
            const img_url = valueFields.img_url; // "https://..."
            const layer = valueFields.layer_type.fields.type; // "Base", "Eyes", 등

            if (!acc[layer]) acc[layer] = [];
            acc[layer].push({ type, img_url });

            return acc;
          },
          {}
        );

        const layers =
          content?.fields?.layer_types?.fields?.contents.map((entry: any) => {
            const { order, type } = entry.fields.value.fields;
            return { order: Number(order), type };
          }) ?? [];

        layers.sort((a: any, b: any) => a.order - b.order);

        const name = {
          name: "name",
          content: content?.fields?.base_type?.fields?.name ?? "Unknown",
        };

        const dynamic = res
          .slice(1)
          .filter((item) => item.data && item.data.content)
          .map((item) => (item.data!.content as any).fields.value.fields);

        const merged = [name, ...dynamic].reduce(
          (acc, item) => {
            acc[item.name] = item.content;
            return acc;
          },
          {} as Record<string, any>
        );

        setResult({ ...merged, layers, items: itemsByLayer });
      } catch (e) {
        console.error("Error fetching collection detail:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionInfo();
  }, [collectionId, data, isPending, error]);

  return { data: result, loading, error };
};
