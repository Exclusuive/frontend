import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiObjectResponse } from "@mysten/sui/client";

const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
const MODULE_ID = import.meta.env.VITE_MODULE;
const COL_CAP_TYPE = `${PACKAGE_ID}::${MODULE_ID}::Item`;

export const useGetItemInfo = (address: string, collectionId: string) => {
  const [loading, setLoading] = useState(true);

  const { data, error } = useSuiClientQuery("getOwnedObjects", {
    owner: address,
    filter: { StructType: COL_CAP_TYPE },
    options: {
      showType: true,
      showContent: true,
    },
  });

  const { data: layerInfo } = useSuiClientQuery("getObject", {
    id: collectionId,
    options: {
      showType: true,
      showContent: true,
    },
  });

  const content = layerInfo?.data?.content as any;

  const layers =
    content?.fields?.layer_types?.fields?.contents?.map((entry: any) => entry.fields.type) ?? [];

  const formatted = data?.data.map((item: any) => {
    const fields = item.data.content.fields;

    return {
      id: fields.id.id,
      layer: fields.type.fields.type,
      type: fields.item_type,
      img_url: fields.img_url,
    };
  });

  // 1. 초기화된 빈 그룹 객체 만들기
  const groupedItems: Record<string, any[]> = {};

  // 2. layer들을 기반으로 key 초기화
  layers.forEach((layer: string) => {
    groupedItems[layer] = [];
  });

  // 3. items 배열 순회하면서 해당 layer 키에 넣기
  formatted?.forEach((item) => {
    if (groupedItems[item.layer]) {
      groupedItems[item.layer].push(item);
    }
  });

  return { data: groupedItems, loading, error };
};
