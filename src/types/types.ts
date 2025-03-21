export interface CollectionCardProps {
  bannerUrl: string;
  title: string;
  description: string;
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
