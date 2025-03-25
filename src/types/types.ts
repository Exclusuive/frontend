export interface CollectionCardProps {
  bannerUrl: string | undefined;
  title: string | undefined;
  description: string | undefined;
  showManage: boolean;
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
export type CreateProps = {
  collectionName: string;
  collectionInfo: string;
  bannerImageFile: File | null;
};

export type CreateCollectionTransactionProps = {
  collectionInfo: string;
  collectionName: string;
  bannerImageFile: File | null;
};
