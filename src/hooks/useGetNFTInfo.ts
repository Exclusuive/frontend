import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiObjectResponse } from "@mysten/sui/client";

export const useGetNFTInfo = (collectionId: string) => {
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

      try {
        const res: SuiObjectResponse[] = await suiClient.multiGetObjects({
          ids: objectIds,
          options: {
            showContent: true,
          },
        });

        // 경로 추출
        const result: any = res.map((item) => {
          const content = item?.data?.content;

          // 타입 가드: fields가 있는지 런타임에서 확인
          if (!content || !("fields" in content)) return false;

          // 타입 단언: 타입 시스템한테 알려주기
          const fields = (content as any).fields;

          const valueFields = fields.value.fields;
          const displayType = valueFields?.type?.fields?.type;
          const internalType = valueFields?.socket?.fields?.type?.fields?.type;
          const imgUrl = valueFields?.socket?.fields?.type?.fields?.img_url;
          const order = valueFields?.type?.fields?.order;

          if (!displayType || !internalType || !imgUrl || !order) return {}; // 빠진 값이 있으면 skip

          return {
            [displayType]: {
              type: internalType,
              img_url: imgUrl,
              order: order,
            },
          };
        });

        // 병합 (여러 객체를 하나로 합치기)
        const mergedResult = Object.assign({}, ...result);

        setResult({ ...mergedResult });
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
