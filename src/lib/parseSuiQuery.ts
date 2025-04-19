import { TransactionResult } from "@/types/contract";
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

export const parseBasicCollectionInfo = (result: SuiObjectResponse[]) => {
  const basicCollectionInfo = result[0].data?.content;

  if (!basicCollectionInfo || typeof basicCollectionInfo !== "object") {
    throw new Error("Invalid collection data format");
  }
};
