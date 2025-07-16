import { Mission } from "./mission";

export interface Attribute {
  name: string;
  value: number;
}

export interface Ticket {
  name: string;
  value: number;
}

export interface Market {
  market_id: string;
  market_cap_id: string;
  collection_id: string;
  name: string;
  listings?: Listing[];
}

export interface Listing {
  market_id: string;
  listing_number: number;
  item: CollectionItem;
  value: number;
  price: number;
  conditions?: Ticket[];
  created_at: string;
  updated_at: string;
}

// Type definition based on the provided JSON structure
export interface CollectionItem {
  id: string;
  collection_id: string;
  name: string;
  img_url: string;
  layer: string;
  description?: string;
  attributes?: Attribute[];
  created_at?: string;
  address?: string;
}

export interface Membership {
  collection_id: string;
  membership_id: string;
  address: string;
  img_url: string;
  equipped_items?: CollectionItem[];
}

export interface Collection {
  collection_id: string;
  collection_cap_id: string;
  name: string;
  img_url?: string;
  description?: string;
  category?: string | null;
  created_at: string;
  updated_at: string;
  attributes?: string[];
  layers?: string[];
  tickets?: string[];
  items?: CollectionItem[];
  missions?: Mission[];
  markets?: Market[];
  memberships?: Membership[];
  selected_membership?: Membership;
}
