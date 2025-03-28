export interface CollectionCardProps {
  bannerUrl: string | undefined;
  title: string | undefined;
  description: string | undefined;
}

export interface ProfileCardProps {
  viewItem: string;
  setViewItem: (item: string) => void;
}

export interface MakeCollectionProps {
  goBack: () => void;
}

export interface NFTOptionsProps {
  setSelectedOption: (option: "create" | "apply") => void;
}
export type CreateCollectionProps = {
  collectionName: string;
};

export type AddInfoProps = {
  id: string;
  capId: string;
  name: string;
  content: string;
};

export type AddLayerProps = {
  id: string;
  capId: string;
  name: string;
  order: number;
};

export type NewCollectionProps = {
  collectionName: string;
  description: string;
  bannerImageFile: File | null;
  layers: Layer[];
};

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

export type Layer = {
  name?: string;
  order?: number;
  type?: string;
};

export type Items = {
  type?: string;
};

type Collection = {
  name: string;
  description: string;
  bannerImg: string;
  layers: Layer[];
};

export interface CollectionInfoProps {
  data: Collection;
  setSelectedOption: (
    option: "collection" | "layer" | "addItem" | "mintBase" | "mintItem" | "rules"
  ) => void;
}

export interface AddItemProps {
  id: string;
  capId: string;
  layer: string;
  itemName: string;
  itemImg: File | null;
}

export interface MintBaseProps {
  id: string;
  capId: string;
  imgUrl: string;
  toAddress: string;
}

export type MintItemProps = {
  id: string;
  capId: string;
  baseId: string;
  itemType: string;
};
