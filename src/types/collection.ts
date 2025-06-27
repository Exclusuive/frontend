export interface Item {
  name: string;
  address: string;
  imgUrl: string;
  layer: string;
  description?: string;
  properties?: { name: string; value: string }[];
}

export interface Collection {
  address: string;
  imgUrl?: string;
  name: string;
  description?: string;
  layers?: string[];
  properties?: string[];
  tickets?: string[];
  items?: Item[];
}
