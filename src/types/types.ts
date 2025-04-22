export interface Collection {
  collection_id: string;
  cap_id?: string;
  name: string;
  description: string;
  img_url: string;
  layer_types?: string[];
  property_types?: string[];
  ticket_types?: string[];
  item_types?: ItemType[];
}

export interface ItemType {
  name: string;
  layer: string;
  img_url: string;
  property_types?: { type: string; value: number }[];
}
// Sui blockchain data types
export interface TypeField {
  fields: {
    type: string;
  };
}

export interface ContentArray<T> {
  fields: {
    contents: Array<T>;
  };
}

export interface TypeContent {
  fields: {
    type: string;
  };
}

export interface ItemTypeContent {
  fields: {
    item_type: string;
    type: TypeField;
    img_url: string;
  };
}

export interface CollectionFields {
  fields: {
    id: {
      id: string;
    };
    cap_id?: string;
    base_type: TypeField;
    description: string;
    img_url: string;
    ticket_types: ContentArray<TypeContent>;
    property_types: ContentArray<TypeContent>;
    layer_types: ContentArray<TypeContent>;
    supplier_type: string;
    item_types: ContentArray<ItemTypeContent>;
  };
}

// Define Supplier type
export interface Store {
  store_id: string;
  store_cap_id: string;
  collection_id: string;
  name: string;
  balance: number;
  slots?: Slot[];
}

export interface StoreFields {
  fields: {
    slots: never[];
    id: {
      id: string;
    };
    collection_id: string;
    name: string;
    balance: number;
  };
}
export interface Slot {
  fields: {
    number: number;
    price: number;
    conditions?: Condition[];
    type: string;
    product?: Product;
    products?: Product[];
  };
}

export interface Product {
  id: string;
  img_url?: string;
  value?: string;
  type?: string;
  amount?: number;
  fields?: {
    name: string;
    conditions?: Condition[];
  };
}

export interface Condition {
  ticket_type: string;
  requirements: string;
  fields?: {
    ticket_type: string;
    requirements: string;
  };
}
