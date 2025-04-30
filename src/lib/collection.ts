import { CollectionObjectData, DynamicFieldObjectData } from "@/types/collection";
import { SuiObjectData } from "@mysten/sui/client";

export const parseCollectionObjectData = (data: SuiObjectData): CollectionObjectData | null => {
  const { objectId, version, digest, type, content } = data;

  if (!content || !("fields" in content)) return null;

  const collctionData: CollectionObjectData = {
    objectId,
    version,
    digest,
    type: type!,
    content: {
      dataType: content.dataType,
      type: content.type,
      hasPublicTransfer: content.hasPublicTransfer,
      fields: content.fields,
    },
  };

  // console.log(collctionData);
  return collctionData;
};

export const parseDynamicBaseTypeField = (data: SuiObjectData): DynamicFieldObjectData | null => {
  const { objectId, version, digest, type, content } = data;

  if (!content || !("fields" in content)) return null;

  const parsed: DynamicFieldObjectData = {
    objectId,
    version,
    digest,
    type: type!,
    content: {
      dataType: content.dataType,
      type: content.type,
      hasPublicTransfer: content.hasPublicTransfer,
      fields: content.fields,
    },
  };

  // console.log("dynamic", parsed);

  return parsed;
};
