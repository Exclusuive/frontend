export interface TxArg {
  type: "string" | "u64" | "object" | "variable";
  value: string | number;
}

export type TxCall =
  | {
      assign: string;
      value: TxArg;
    }
  | {
      funcName: string;
      args: TxArg[];
      typeArguments?: string[];
      assign?: string;
    };

// Extract created objects
interface CreatedObject {
  type: string;
  objectType: string;
  objectId: string;
}

export interface TransactionResult {
  objectChanges?: CreatedObject[];
}

export interface Layer {
  id: string;
  name: string;
}

export interface CollectionFormData {
  name: string;
  img_url: File | null;
  description: string;
  layers: Layer[];
}
