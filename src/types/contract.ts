export interface TxArg {
  type: "string" | "u64" | "object" | "variable";
  value: string | number;
}

export type TxCall =
  | {
      assign: string;
      value: TxArg;
    }
  | {
      funcName: string;
      args: TxArg[];
      typeArguments?: string[];
      assign?: string;
    };

// Extract created objects
interface CreatedObject {
  type: string;
  objectType: string;
  objectId: string;
}

export interface TransactionResult {
  objectChanges?: CreatedObject[];
}

export interface Layer {
  id: string;
  name: string;
}

export interface CollectionFormData {
  name: string;
  img_url: File | null;
  description: string;
  layers: Layer[];
}

export type MintItemData = {
  layer: string;
  recipient: string;
  itemName?: string;
  itemImage?: File;
  itemId?: string;
  itemImageUrl?: string;
  properties?: { type: string; value: number }[];
};

export interface MintItemProps {
  id: string;
  capId: string;
  layer: string;
  itemName: string;
  itemImg: File | null;
  itemImageUrl?: string;
  properties?: { type: string; value: number }[];
  toAddress: string;
}
