import { Collection, CollectionItem } from "./collection";

export interface User {
  address: string;
  role: string;
  profile: {
    name: string;
    imgUrl: string;
    age: number;
    sex: string;
    email: string;
    location: string;
    birthDate: string;
    plan: string;
  };
  memberships?: Membership[];
  itemsInWallet?: CollectionItem[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export interface Membership {
  id: string;
  name: string;
  imgUrl?: string;
  ownerAddress: string;
  collection: Collection;
  items: CollectionItem[];
}
