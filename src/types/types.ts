export interface CollectionCardProps {
  bannerUrl: string | undefined;
  title: string | undefined;
  description: string | undefined;
}

export interface ProfileCardProps {
  viewItem: string;
  setViewItem: (item: string) => void;
}

export interface Layer {
  name: string;
  description: string;
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
