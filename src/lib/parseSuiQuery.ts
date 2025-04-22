import { TransactionResult } from "@/types/contract";
import { Collection, CollectionFields, Store, StoreFields } from "@/types/types";
import { SuiObjectResponse } from "@mysten/sui/client";

export const parseCreateCollectionFromCreatedObject = (result: TransactionResult | undefined) => {
  if (!result) {
    return { collection: "", collectionCap: "" };
  }
  const collection: string =
    result?.objectChanges?.filter((item: any) => item.objectType.endsWith("Collection"))[0]
      .objectId || "";
  const collectionCap: string =
    result?.objectChanges?.filter((item: any) => item.objectType.endsWith("CollectionCap"))[0]
      .objectId || "";

  return { collection, collectionCap };
};

export const parseBasicCollectionInfo = (raw: SuiObjectResponse[]) => {
  const basicCollectionInfo = raw[0].data?.content;

  if (!basicCollectionInfo || typeof basicCollectionInfo !== "object") {
    throw new Error("Invalid collection data format");
  }

  const typedContent = basicCollectionInfo as unknown as CollectionFields;
  const result = {
    description: null as string | null,
    img_url: null as string | null,
  };

  for (const item of raw.slice(1)) {
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

  const collectionInfo = {
    collection_id: typedContent.fields.id.id,
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

  // Extract items with their details
  const items = typedContent.fields.item_types.fields.contents.map((entry) => {
    return {
      name: entry.fields.item_type,
      layer: entry.fields.type.fields.type,
      img_url: entry.fields.img_url,
    };
  });

  // Combine all data into a single collection object
  const collectionWithDetails: Collection = {
    ...collectionInfo,
    layer_types: layerTypes,
    property_types: propertyTypes,
    item_types: items,
    ticket_types: ticketTypes,
  };

  return collectionWithDetails;
};

export const parseStoreInfo = (raw: SuiObjectResponse[]) => {
  const basicStoreInfo = raw[0].data?.content;

  if (!basicStoreInfo || typeof basicStoreInfo !== "object") {
    throw new Error("Invalid store data format");
  }

  const typedContent = basicStoreInfo as unknown as StoreFields;

  const parseProductValue = (productValue: any) => {
    if (!productValue?.type) return null;

    if (productValue.type.endsWith("::Item")) {
      return {
        type: "Item",
        item_type: productValue.fields.item_type,
        img_url: productValue.fields.img_url,
      };
    } else if (productValue.type.endsWith("::Property")) {
      return {
        type: "Property",
        property_type: productValue.fields.type.fields.type,
        value: productValue.fields.value,
      };
    } else if (productValue.type.endsWith("::Ticket")) {
      return {
        type: "Ticket",
        ticket_type: productValue.fields.type.fields.type,
      };
    }

    return null;
  };

  const products = raw.slice(1).flatMap((product: any) => {
    const grouped = new Map<string, any>();

    product.data.content.fields.value?.forEach((productValue: any) => {
      const parsed = parseProductValue(productValue);
      if (!parsed) return;

      const key = JSON.stringify(parsed);
      const existing = grouped.get(key);

      if (existing) {
        existing.amount += 1;
      } else {
        grouped.set(key, {
          slot_number: product.data.content.fields.name.fields.slot_number,
          ...parsed,
          amount: 1,
        });
      }
    });

    return Array.from(grouped.values());
  });

  const customSlots = (typedContent.fields.slots || []).map((slot: any) => {
    const number = slot.fields.number;
    const relatedProducts = products.filter((product: any) => product.slot_number === number);

    return {
      ...slot,
      fields: {
        ...slot.fields,
        type: slot.fields.product.fields.name.split("::")[2],
        products: relatedProducts,
      },
    };
  });

  return {
    store_id: typedContent.fields.id.id,
    collection_id: typedContent.fields.collection_id,
    name: typedContent.fields.name || "",
    balance: typedContent.fields.balance || 0,
    slots: customSlots || [],
  } as Store;
};
