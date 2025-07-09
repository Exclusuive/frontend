import { Mission } from "./mission";

export interface Item {
  name: string;
  address: string;
  imgUrl: string;
  layer: string;
  description?: string;
  attributes?: Attribute[];
}

export interface Attribute {
  name: string;
  value: number;
}

export interface Market {
  address: string;
  name: string;
  slots: Slot[];
}

export interface Slot {
  items: Item[];
  price: number;
  conditions?: { name: string; value: number }[];
}

export interface Collection {
  id: string;
  cap?: string;
  name: string;
  configs?: {
    img_url?: string;
    description?: string;
  };
  layer_types?: string[];
  attribute_types?: string[];
  ticket_types?: string[];
  items?: Item[];
  market?: Market[];
  missions?: Mission[];
}
