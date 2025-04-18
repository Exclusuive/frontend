import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { getMultiObjectFields } from "@/lib/sui";
import { getDynamicObjectIds } from "@/lib/sui";

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;
const COL_CAP_TYPE = `${PACKAGE_ID}::${MODULE_ID}::Base`;

export const useCheckUserBases = (address: string, collectionId: string | undefined) => {
  const [result, setResult] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [internalError, setInternalError] = useState<Error | null>(null);
  const suiClient = useSuiClient();

  // address가 없으면 일찍 리턴
  const disabled = !address;
  const { data, isPending, error } = useSuiClientQuery("getOwnedObjects", {
    owner: address,
    filter: { StructType: COL_CAP_TYPE },
    options: {
      showType: true,
      showContent: true,
    },
  });

  useEffect(() => {
    if (disabled || !data || isPending || error || !collectionId) return;
    const result = data.data.filter((item) => {
      const content = item?.data?.content;
      if (!content || !("fields" in content)) return false;

      const fields = (content as any).fields;
      const collection_id = fields?.type?.fields?.collection_id;
      return collection_id === collectionId;
    });

    const baseIds = Array.from(
      new Set(
        result.map((item) => {
          const content = item?.data?.content;
          const fields = (content as any).fields;

          return {
            id: fields?.id.id,
            name: fields?.type.fields.type,
            img_url: fields?.img_url,
            collection_id: fields?.type.fields.collection_id,
          };
        })
      )
    );

    const fetchItemBags = async () => {
      const allItemBags = await Promise.all(
        baseIds.map(async (baseId) => {
          try {
            const dynamicIds = await getDynamicObjectIds(suiClient, baseId.id);
            const allIds = [baseId.id, ...dynamicIds];
            const allFields = await getMultiObjectFields(suiClient, allIds);
            const parseItemBagValue = (itemBag: any) => {
              if (!itemBag?.name?.type?.includes("::ItemBagKey")) return null;

              const type = itemBag.name.fields.type;
              const items = itemBag.value.map((item: any) => ({
                id: item.fields.id.id,
                img_url: item.fields.img_url,
                item_type: item.fields.item_type,
                layer_type: item.fields.type.fields.type,
              }));

              return { type, items };
            };

            const parseItemSocketValue = (itemSocket: any) => {
              if (!itemSocket?.value?.type?.includes("::ItemSocket")) return null;

              const type = itemSocket.value.fields.socket.fields.type.type;

              const item = {
                id: itemSocket.value.fields.socket.fields.id.id,
                img_url: itemSocket.value.fields.socket.fields.img_url,
                item_type: itemSocket.value.fields.socket.fields.item_type,
                layer_type: itemSocket.value.fields.socket.fields.type.fields.type,
              };

              return { type, item };
            };

            const itemBags = (() => {
              const grouped = new Map<string, any[]>();

              allFields.forEach((field: any) => {
                const parsed = parseItemBagValue(field);
                if (!parsed) return;

                // Map에 없으면 빈 배열로 초기화
                if (!grouped.has(parsed.type)) {
                  grouped.set(parsed.type, []);
                }

                // 기존 배열에 추가
                grouped.get(parsed.type)!.push(...parsed.items);
              });

              return Array.from(grouped.entries()).map(([type, items]) => ({
                type,
                items,
              }));
            })();

            const itemSockets = (() => {
              const grouped = new Map<string, any[]>();

              allFields.forEach((field: any) => {
                const parsed = parseItemSocketValue(field);
                if (!parsed) return;

                // Map에 없으면 빈 배열로 초기화
                if (!grouped.has(parsed.item.layer_type)) {
                  grouped.set(parsed.item.layer_type, []);
                }

                // 기존 배열에 items 추가
                grouped.get(parsed.item.layer_type)!.push(parsed.item);
              });

              return Array.from(grouped.entries()).map(([type, items]) => ({
                type,
                items,
              }));
            })();

            return { ...baseId, itemsBags: itemBags, itemSockets: itemSockets };
          } catch (e) {
            console.error("Failed to fetch collection info:", e);
            return null;
          }
        })
      );

      setResult(allItemBags);
    };
    fetchItemBags();

    setLoading(false);
    setInternalError(null);
  }, [data, isPending, error, disabled, collectionId]);

  return {
    data: result,
    loading,
    error: error || internalError,
  };
};
