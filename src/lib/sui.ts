export function mergeFields(data: { name: string; content: any }[]) {
  return data.reduce(
    (acc, item) => {
      const key = item.name === "banner_url" ? "img_url" : item.name; // ✅ key 이름 변경
      acc[key] = item.content;
      return acc;
    },
    {} as Record<string, any>
  );
}

export function extractCollectionIds(data: any[]) {
  return data
    .map((obj) => {
      const content = obj.data?.content;
      if (
        content?.dataType === "moveObject" &&
        "fields" in content &&
        "collection_id" in content.fields
      ) {
        return {
          collection_id: content.fields.collection_id as string,
          cap_id: obj.data?.objectId as string,
        };
      }
      return null;
    })
    .filter(Boolean) as { collection_id: string; cap_id: string }[];
}

export async function getDynamicObjectIds(suiClient: any, parentId: string): Promise<string[]> {
  const { data } = await suiClient.getDynamicFields({ parentId });
  return data.map((item: any) => item.objectId);
}

export async function getMultiObjectFields(suiClient: any, objectIds: string[]) {
  const response = await suiClient.multiGetObjects({
    ids: objectIds,
    options: { showContent: true },
  });

  return response.filter((r: any) => r.data?.content).map((r: any) => r.data.content.fields);
}
