export interface Collection {
  collection_id: string;
  cap_id: string;
  name: string;
  description: string;
  img_url: string;

  items?: string[];
}

// Collection item type for detailed item information
export interface CollectionItem {
  name: string;
  layer: string;
  img_url: string;
  type: string;
}

// Extended collection type with additional details
export interface CollectionWithDetails extends Omit<Collection, "items"> {
  layer_types: string[];
  property_types: string[];
  ticket_types: string[];
  items: CollectionItem[];
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
    cap_id: string;
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
export interface Supplier {
  supplier_id: string;
  supplier_cap_id: string;
  collection_id: string;
  name: string;
  balance: number;
  selections?: Selection[];
}

export interface Selection {
  fields: {
    number: number;
    price: number;
    conditions?: Condition[];
    product?: Product;
  };
}

export interface Product {
  id: string;

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
