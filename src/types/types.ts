export interface CollectionCardProps {
  collectionId: string;
  capId: string;
  name: string;
  banner_url: string;
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

export interface MintItemProps {
  id: string;
  capId: string;
  layer: string;
  itemName: string;
  itemImg: File | null;
  toAddress: string;
}

export interface Layer {
  type?: string;
}
export type NewCollectionProps = {
  collectionName: string;
  description: string;
  bannerImageFile: File | null;
  layers: Layer[];
  onDone?: () => void;
};

export type EditCollectionProps = {
  id: string;
  capId: string;
  collectionName: string;
  description: string;
  bannerImageFile: File | null;
  changedField: "description" | "bannerImageFile" | "both";
};

export type EditLayerProps = {
  id: string;
  capId: string;
  layers: Layer[];
};

export interface EquipItemProps {
  id: string;
  baseId: string;
  itemId: string;
}

export interface AddCollectionTypeProps {
  id: string;
  capId: string;
  type: string;
}

export interface GivePropertyProps {
  id: string;
  capId: string;
  type: string;
  value: number;
  toAddress: string;
}

export interface CreateSupplierProps {
  id: string;
  capId: string;
}

export interface AddSelectionProps {
  collectionId: string;
  supplyId: string;
  supplyCapId: string;
  price: number;
}
