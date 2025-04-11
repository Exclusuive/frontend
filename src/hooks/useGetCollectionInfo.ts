import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiObjectResponse } from "@mysten/sui/client";

export const useGetCollectionInfo = (collectionId: string) => {
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
        const itemsByLayer = (content?.fields?.item_types?.fields?.contents ?? []).reduce(
          (acc: Record<string, { type: string; img_url: string }[]>, entry: any) => {
            const valueFields = entry.fields;

            const type = valueFields.item_type; // "pppl"
            const img_url = valueFields.img_url; // "https://..."
            const layer = valueFields.type.fields.type; // "Base", "Eyes", 등

            if (!acc[layer]) acc[layer] = [];
            acc[layer].push({ type, img_url });

            return acc;
          },
          {}
        );

        const layers =
          content?.fields?.layer_types?.fields?.contents.map((entry: any) => {
            const { type } = entry.fields;
            return { type };
          }) ?? [];

        const properties =
          content?.fields?.property_types?.fields?.contents.map((entry: any) => {
            const { type } = entry.fields;
            return { type };
          }) ?? [];
        const tickets =
          content?.fields?.ticket_types?.fields?.contents.map((entry: any) => {
            const { type } = entry.fields;
            return { type };
          }) ?? [];

        const name = {
          name: "name",
          content: content?.fields?.base_type?.fields?.type ?? "Unknown",
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

        setResult({ ...merged, layers, properties, tickets, items: itemsByLayer });
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
