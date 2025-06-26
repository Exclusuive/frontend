import { ORIGIN_PACKAGE_ID } from "@/config/contants";
import { parseCollectionObjectData, parseDynamicBaseTypeField } from "@/lib/collection";
import { CollectionData, ItemType } from "@/types/collection";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { useEffect, useState } from "react";

export const useGetMyCollections = ({ owner }: { owner: string }) => {
  const [collections, setCollecitons] = useState<CollectionData[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const COL_CAP_TYPE = `${ORIGIN_PACKAGE_ID}::collection::CollectionCap`;

  const client = new SuiClient({ url: getFullnodeUrl("testnet") });

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    client
      .getOwnedObjects({
        owner,
        filter: { StructType: COL_CAP_TYPE },
        options: {
          showType: true,
          showContent: true,
        },
      })
      .then(async (data) => {
        const capIds = data.data.flatMap((item) => {
          const content = item.data?.content;
          if (
            content &&
            "fields" in content &&
            content.fields !== null &&
            "id" in content.fields &&
            typeof content.fields.id === "object" &&
            content.fields.id !== null &&
            "id" in content.fields.id &&
            typeof content.fields.id.id === "string"
          ) {
            return [content.fields.id.id];
          }
          return [];
        });
        const collectionIds = data.data.flatMap((item) => {
          const content = item.data?.content;
          if (
            content &&
            "fields" in content &&
            "collection_id" in content.fields &&
            typeof content.fields.collection_id === "string"
          ) {
            return [content.fields.collection_id];
          }
          return [];
        });

        const [objectDataArray, dynamicFieldDatasArray] = await Promise.all([
          Promise.all(
            collectionIds.map((id) =>
              client.getObject({
                id,
                options: {
                  showType: true,
                  showContent: true,
                },
              })
            )
          ),
          Promise.all(
            collectionIds.map((id) =>
              client
                .getDynamicFields({ parentId: id }) // line break
                .then((data) => {
                  const dynamicFieldObjectIds = data.data.map((d) => {
                    return d.objectId;
                  });

                  return client.multiGetObjects({
                    ids: dynamicFieldObjectIds,
                    options: { showContent: true, showType: true },
                  });
                })
            )
          ),
        ]);

        return collectionIds.map((id, i) => {
          if (!objectDataArray[i].data) return;

          const collectionObjectData = parseCollectionObjectData(objectDataArray[i].data);

          if (!collectionObjectData) return;

          const parsedDynamicFieldDatas = dynamicFieldDatasArray[i].map((d) => {
            if (!d.data) return null;
            return parseDynamicBaseTypeField(d.data);
          });

          const filteredDynamicFieldDatas = parsedDynamicFieldDatas.filter(
            (value) => value !== null
          );

          if (filteredDynamicFieldDatas.length !== parsedDynamicFieldDatas.length) {
            return;
          }

          return {
            id,
            cap: capIds[i],
            objectData: collectionObjectData,
            dynamicFieldData: filteredDynamicFieldDatas,
          } as CollectionData;
        });
      })
      .then((collections) => {
        const collectionsWithoutNull = collections.flatMap((c) => {
          if (!c) return [];
          return c;
        });

        setCollecitons(collectionsWithoutNull);
        setIsPending(false);
        setError(null);
      })
      .catch((e) => {
        setError(e);
      });
  }, [owner, refetchSwitch]);

  return {
    collections,
    isPending,
    error,
    refetch,
  };
};

export const useGetUserCollections = ({ userAddress }: { userAddress: string }) => {
  const [collections, setCollecitons] = useState<CollectionData[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const COL_CAP_TYPE = `${ORIGIN_PACKAGE_ID}::collection::Base`;

  const client = new SuiClient({ url: getFullnodeUrl("testnet") });

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    client
      .getOwnedObjects({
        owner: userAddress,
        filter: { StructType: COL_CAP_TYPE },
        options: {
          showType: true,
          showContent: true,
        },
      })
      .then(async (data) => {
        const baseObjects = data.data
          .map((item) => {
            const content = item.data?.content;
            if (
              content &&
              "fields" in content &&
              "type" in content.fields &&
              typeof content.fields.type === "object" &&
              content.fields.type !== null &&
              "fields" in content.fields.type &&
              content.fields.type.fields !== null &&
              typeof content.fields.type.fields === "object" &&
              "collection_id" in content.fields.type.fields &&
              typeof content.fields.type.fields.collection_id === "string"
            ) {
              return {
                baseId: item.data?.objectId,
                collectionId: content.fields.type.fields.collection_id,
                baseData: content,
              };
            }
            return null;
          })
          .filter((item): item is NonNullable<typeof item> => item !== null);

        const collectionIds = Array.from(new Set(baseObjects.map((item) => item.collectionId)));

        const [objectDataArray, dynamicFieldDatasArray] = await Promise.all([
          Promise.all(
            collectionIds.map((id) =>
              client.getObject({
                id,
                options: {
                  showType: true,
                  showContent: true,
                },
              })
            )
          ),
          Promise.all(
            collectionIds.map((id) =>
              client.getDynamicFields({ parentId: id }).then((data) => {
                const dynamicFieldObjectIds = data.data.map((d) => {
                  return d.objectId;
                });

                return client.multiGetObjects({
                  ids: dynamicFieldObjectIds,
                  options: { showContent: true, showType: true },
                });
              })
            )
          ),
        ]);

        const [baseObjectData, baseDynamicFieldDatas] = await Promise.all([
          Promise.all(
            data.data.map((base) =>
              client.getObject({
                id: base.data?.objectId || "",
                options: {
                  showType: true,
                  showContent: true,
                },
              })
            )
          ),
          Promise.all(
            data.data.map((base) =>
              client.getDynamicFields({ parentId: base.data?.objectId || "" }).then((data) => {
                const dynamicFieldObjectIds = data.data.map((d) => {
                  return d.objectId;
                });

                return client.multiGetObjects({
                  ids: dynamicFieldObjectIds,
                  options: { showContent: true, showType: true },
                });
              })
            )
          ),
        ]);

        return collectionIds.map((id, i) => {
          if (!objectDataArray[i].data) return;

          const collectionObjectData = parseCollectionObjectData(objectDataArray[i].data);

          if (!collectionObjectData) return;

          const parsedDynamicFieldDatas = dynamicFieldDatasArray[i].map((d) => {
            if (!d.data) return null;
            return parseDynamicBaseTypeField(d.data);
          });

          const filteredDynamicFieldDatas = parsedDynamicFieldDatas.filter(
            (value) => value !== null
          );

          if (filteredDynamicFieldDatas.length !== parsedDynamicFieldDatas.length) {
            return;
          }

          const bases = baseObjects.filter((base) => base.collectionId === id);

          return {
            id,
            objectData: collectionObjectData,
            dynamicFieldData: filteredDynamicFieldDatas,
            bases: bases.map((base, baseIndex) => {
              const baseObject = baseObjectData.find((obj) => obj.data?.objectId === base.baseId);
              const baseDynamicFields = baseDynamicFieldDatas[baseIndex];

              const parsedBaseDynamicFields = baseDynamicFields
                .map((d) => {
                  if (!d.data) return null;
                  return parseDynamicBaseTypeField(d.data);
                })
                .filter((value): value is NonNullable<typeof value> => value !== null);

              return {
                id: base.baseId!,
                data: base.baseData,
                objectData: baseObject?.data
                  ? parseCollectionObjectData(baseObject.data)
                  : undefined,
                dynamicFieldData: parsedBaseDynamicFields,
              };
            }),
          } as CollectionData;
        });
      })
      .then((collections) => {
        const collectionsWithoutNull = collections.flatMap((c) => {
          if (!c) return [];
          return c;
        });

        setCollecitons(collectionsWithoutNull);
        setIsPending(false);
        setError(null);
      })
      .catch((e) => {
        setError(e);
      });
  }, [userAddress, refetchSwitch]);

  return {
    collections,
    isPending,
    error,
    refetch,
  };
};

export const useGetAllCollection = () => {
  const [collections, setCollections] = useState<CollectionData[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const client = new SuiClient({ url: getFullnodeUrl("testnet") });

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    client
      .queryEvents({
        query: { MoveEventType: `${ORIGIN_PACKAGE_ID}::collection::CollectionCreated` },
        order: "ascending",
        limit: 20,
      })
      .then(async (data) => {
        console.log(data.data);
        const collectionIds = data.data.map((event: any) => {
          return event.parsedJson.id;
        });

        const [objectDataArray, dynamicFieldDatasArray] = await Promise.all([
          Promise.all(
            collectionIds.map((id) =>
              client.getObject({
                id,
                options: {
                  showType: true,
                  showContent: true,
                },
              })
            )
          ),
          Promise.all(
            collectionIds.map((id) =>
              client
                .getDynamicFields({ parentId: id }) // line break
                .then((data) => {
                  const dynamicFieldObjectIds = data.data.map((d) => {
                    return d.objectId;
                  });

                  return client.multiGetObjects({
                    ids: dynamicFieldObjectIds,
                    options: { showContent: true, showType: true },
                  });
                })
            )
          ),
        ]);

        return collectionIds.map((id, i) => {
          if (!objectDataArray[i].data) return;

          const collectionObjectData = parseCollectionObjectData(objectDataArray[i].data);

          if (!collectionObjectData) return;

          const parsedDynamicFieldDatas = dynamicFieldDatasArray[i].map((d) => {
            if (!d.data) return null;
            return parseDynamicBaseTypeField(d.data);
          });

          const filteredDynamicFieldDatas = parsedDynamicFieldDatas.filter(
            (value) => value !== null
          );

          if (filteredDynamicFieldDatas.length !== parsedDynamicFieldDatas.length) {
            return;
          }

          return {
            id,
            objectData: collectionObjectData,
            dynamicFieldData: filteredDynamicFieldDatas,
          } as CollectionData;
        });
      })
      .then((collections) => {
        const collectionsWithoutNull = collections.flatMap((c) => {
          if (!c) return [];
          return c;
        });

        setCollections(collectionsWithoutNull);
        setIsPending(false);
        setError(null);
      })
      .catch((e) => {
        setError(e);
      });
  }, [refetchSwitch]);

  return {
    collections,
    isPending,
    error,
    refetch,
  };
};

export const useGetMyItems = ({ owner }: { owner: string }) => {
  const [items, setItems] = useState<ItemType[]>([]);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [refetchSwitch, setRefetchSwitch] = useState(false);

  const COL_CAP_TYPE = `${ORIGIN_PACKAGE_ID}::collection::Item`;

  const client = new SuiClient({ url: getFullnodeUrl("testnet") });

  const refetch = () => {
    setRefetchSwitch((prev) => !prev);
  };

  useEffect(() => {
    client
      .getOwnedObjects({
        owner,
        filter: { StructType: COL_CAP_TYPE },
        options: {
          showType: true,
          showContent: true,
        },
      })
      .then(async (data) => {
        setItems(
          data.data.map((item: any) => {
            return {
              type: item.data?.content?.type,
              fields: item.data?.content?.fields,
            };
          })
        );
        setIsPending(false);
        setError(null);
      })
      .catch((e) => {
        setError(e);
      });
  }, [owner, refetchSwitch]);

  return {
    items,
    isPending,
    error,
    refetch,
  };
};
