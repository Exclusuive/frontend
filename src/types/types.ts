export interface CollectionCardProps {
  collectionId: string;
  capId: string;
  name: string;
  bannerImg: string;
  description: string;
}

// Transaction Types

export type TxArg =
  | { type: "string"; value: string }
  | { type: "u64"; value: number }
  | { type: "object"; value: string }
  | { type: "variable"; value: string };

export type TxCall =
  | {
      assign: string;
      value: { type: "string"; value: string } | { type: "u64"; value: number };
    }
  | {
      funcName: string;
      args: TxArg[];
      typeArguments?: string[];
      assign?: string;
    };

export interface AddItemProps {
  id: string;
  capId: string;
  layer: string;
  itemName: string;
  itemImg: File | null;
}

// Backend Types

export interface UploadToS3Params {
  type: string;
  id: string;
  file: File | null;
}

export interface MintBaseProps {
  id: string;
  capId: string;
  toAddress: string;
}

export type MintItemProps = {
  id: string;
  capId: string;
  baseId: string;
  itemType: string;
};
