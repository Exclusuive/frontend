export interface Collection {
  id: string;
  // cap_id?: string;
  // name: string;
  // description: string;
  // img_url: string;
  base_type: CollectionPropertyType;
  layer_types: CollectionPropertyType[];
  property_types: CollectionPropertyType[];
  ticket_types: CollectionPropertyType[];
  item_types: ItemType[];
  balance: BigInt;
  version: BigInt;
  configs: Config[];
}

interface CollectionPropertyType {
  collection_id: string;
  type: string;
}
interface Config {
  name: string;
  content: string;
}

interface ItemType {
  name: string;
  layer: string;
  img_url: string;
  property_types?: { type: string; value: number }[];
}
