import { useEffect, useState } from "react";
import { useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
import { SuiObjectResponse } from "@mysten/sui/client";
import { Collection, CollectionWithDetails, CollectionFields } from "@/types/types";

export const useGetCollection = (collectionId: string, capId: string) => {
  const [collection, setCollection] = useState<CollectionWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const suiClient = useSuiClient();

  const {
    data,
    isPending,
    error: queryError,
  } = useSuiClientQuery("getDynamicFields", {
    parentId: collectionId,
  });

  useEffect(() => {
    const fetchCollectionInfo = async () => {
      if (!data || isPending || queryError) return;

      const objectIds = data.data.map((item) => item.objectId);
      const objects = [collectionId, ...objectIds];

      try {
        const res: SuiObjectResponse[] = await suiClient.multiGetObjects({
          ids: objects,
          options: {
            showContent: true,
          },
        });

        console.log(res);

        const content = res[0].data?.content;

        // Safely cast the content to our typed interface
        if (!content || typeof content !== "object") {
          throw new Error("Invalid collection data format");
        }

        // Use a two-step casting to avoid TypeScript errors
        const typedContent = content as unknown as CollectionFields;

        const result = {
          description: null as string | null,
          img_url: null as string | null,
        };

        for (const item of res) {
          if (!item.data?.content) continue;

          const content = item.data.content;

          // Skip if content doesn't have the expected structure
          if (!content || typeof content !== "object") continue;

          // Check if content has a type property
          const type = typeof content === "object" && "type" in content ? String(content.type) : "";

          // ConfigKey<BaseType> 형식만 필터
          if (type.includes("::collection::ConfigKey")) {
            try {
              // Safely access nested properties with type guards
              if (
                typeof content === "object" &&
                content !== null &&
                "fields" in content &&
                content.fields &&
                typeof content.fields === "object" &&
                "name" in content.fields &&
                content.fields.name &&
                typeof content.fields.name === "object" &&
                "fields" in content.fields.name &&
                content.fields.name.fields &&
                typeof content.fields.name.fields === "object" &&
                "name" in content.fields.name.fields
              ) {
                const nameField = String(content.fields.name.fields.name);

                if (
                  "value" in content.fields &&
                  content.fields.value &&
                  typeof content.fields.value === "object" &&
                  "fields" in content.fields.value &&
                  content.fields.value.fields &&
                  typeof content.fields.value.fields === "object" &&
                  "content" in content.fields.value.fields
                ) {
                  const valueField = String(content.fields.value.fields.content);

                  if (nameField === "description") {
                    result.description = valueField;
                  } else if (nameField === "img_url") {
                    result.img_url = valueField;
                  }
                }
              }
            } catch (err) {
              console.warn("Error processing config key:", err);
              // Continue processing other items
            }
          }
        }

        const baseCollection: Omit<Collection, "items"> = {
          collection_id: collectionId,
          cap_id: capId,
          name: typedContent.fields.base_type.fields.type,
          description: result.description ?? "",
          img_url: result.img_url ?? "",
        };

        // Extract layer types
        const layerTypes = typedContent.fields.layer_types.fields.contents.map(
          (entry) => entry.fields.type
        );

        // Extract property types
        const propertyTypes = typedContent.fields.property_types.fields.contents.map(
          (entry) => entry.fields.type
        );

        const ticketTypes = typedContent.fields.ticket_types.fields.contents.map(
          (entry) => entry.fields.type
        );

        // Extract supplier type
        const supplierType = typedContent.fields.supplier_type;

        // Extract items with their details
        const items = typedContent.fields.item_types.fields.contents.map((entry) => {
          return {
            name: entry.fields.item_type,
            layer: entry.fields.type.fields.type,
            img_url: entry.fields.img_url,
            type: entry.fields.item_type,
          };
        });

        // Combine all data into a single collection object
        const collectionWithDetails: CollectionWithDetails = {
          ...baseCollection,
          layer_types: layerTypes,
          property_types: propertyTypes,
          supplier_type: supplierType,
          items: items,
          ticket_types: ticketTypes,
        };

        setCollection(collectionWithDetails);
        setError(null);
      } catch (e) {
        console.error("Error fetching collection detail:", e);
        setError(e instanceof Error ? e : new Error("Unknown error occurred"));
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionInfo();
  }, [collectionId, data, isPending, queryError, suiClient]);

  return {
    collection,
    loading,
    error,
    isPending: loading || isPending,
  };
};
