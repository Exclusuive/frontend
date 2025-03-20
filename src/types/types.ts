export interface CollectionCardProps {
  title: string;
  description: string;
  showManage: boolean;
}

export interface ProfileCardProps {
  viewItem: string;
  setViewItem: (item: string) => void;
}
