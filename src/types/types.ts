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

export type Argument =
  | { type: "string"; value: string }
  | { type: "u64"; value: number | bigint }
  | { type: "object"; value: string };

export type TxCall = {
  funcName: string;
  typeArguments?: string[];
  args: Argument[];
};

export type Layer = {
  name?: string;
  order?: number;
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
  setSelectedOption: (option: "collection" | "layer" | "item") => void;
}

export interface AddItemProps {
  id: string;
  capId: string;
  layer: string;
  itemName: string;
  itemImg: File | null;
}
