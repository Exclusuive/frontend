export interface Collection {
  collection_id: string;
  capId: string;
  name: string;
  description: string;
  img_url: string;
  tickets?: string[];
  properties?: string[];
  items?: string[];
}
