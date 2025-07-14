import { Mission } from "./mission";

export interface Item {
  name: string;
  address: string;
  img_url: string;
  layer: string;
  description?: string;
  attributes?: Attribute[] | string;
}

export interface Attribute {
  name: string;
  value: string;
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
  item_types?: Item[];
  missions?: Mission[];
}
