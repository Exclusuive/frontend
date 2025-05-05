import { MoveStruct } from "@mysten/sui/client";
interface CollectionElementType {
  type: string;
  fields: {
    collection_id: string;
    type: string;
  };
}

export interface ItemType {
  type: string;
  fields: {
    collection_id: string;
    img_url: string;
    item_type: string;
    type: CollectionElementType;
  };
}

export type CollectionType = {
  balance: string;
  base_type: {
    type: string;
    fields: {
      collection_id: string;
      type: string;
    };
  };
  id: {
    id: string;
  };
  item_types: {
    type: string;
    fields: {
      contents: ItemType[];
    };
  };
  layer_types: {
    type: string;
    fields: {
      contents: CollectionElementType[];
    };
  };
  property_types: {
    type: string;
    fields: {
      contents: CollectionElementType[];
    };
  };
  ticket_types: {
    type: string;
    fields: {
      contents: CollectionElementType[];
    };
  };
  version: string;
};

export interface CollectionObjectData {
  objectId: string;
  version: string;
  digest: string;
  type: string;
  content: {
    dataType: string;
    type: string;
    hasPublicTransfer: boolean;
    // fields: CollectionType | MoveStruct;
    fields: CollectionType;
  };
}

export interface CollectionData {
  id: string;
  cap: string;
  objectData: CollectionObjectData;
  dynamicFieldData: DynamicFieldObjectData[]; // 실제 데이터 타입에 맞게 수정
}

export interface DynamicFieldObjectData {
  objectId: string;
  version: string;
  digest: string;
  type: string;
  content: {
    dataType: string;
    type: string;
    hasPublicTransfer: boolean;
    fields: {
      id: {
        id: string;
      };
      name: {
        type: string;
        fields: any;
      };
      value: {
        type: string;
        fields: any;
      };
    };
    // | MoveStruct;
  };
}

// export interface CollectionElementDFType extends DynamicFieldObjectData {
//   content: {
//     dataType: string;
//     type: string;
//     hasPublicTransfer: boolean;
//     fields: {
//       id: {
//         id: string;
//       };
//       name: {
//         type: string;
//         fields: {
//           type: string;
//         };
//       };
//       value: {
//         type: string;
//         fields: CollectionElementType;
//       };
//     };
//   };
// }

// export interface ConfigType extends DynamicFieldObjectData {
//   content: {
//     dataType: string;
//     type: string;
//     hasPublicTransfer: boolean;
//     fields: {
//       id: {
//         id: string;
//       };
//       name: {
//         type: string;
//         fields: {
//           name: string;
//           type: string;
//         };
//       };
//       value: {
//         type: string;
//         fields: {
//           name: string;
//           content: string;
//         };
//       };
//     };
//   };
// }
