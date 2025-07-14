import { Item, Attribute } from "./collection";

export interface Market {
  id: string;
  cap: string;
  name: string;
  listings?: Listing[];
}

export interface Listing {
  id: number;
  items: Item[];
  price: number;
  conditions?: Attribute[];
}
