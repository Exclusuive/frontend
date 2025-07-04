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
  address: string;
  imgUrl?: string;
  name: string;
  description?: string;
  layers?: string[];
  attributes?: string[];
  tickets?: string[];
  items?: Item[];
  market?: Market[];
}
