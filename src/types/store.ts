export interface Condition {
  type: string;
  fields: {
    requirement: string;
    ticket_type: {
      type: string;
      fields: {
        collection_id: string;
        type: string;
      };
    };
  };
}

export interface Slot {
  type: string;
  fields: {
    conditions: Condition[];
    number: number;
    price: number;
    product: {
      type: string;
      fields: {
        name: string;
      };
    };
  };
}
export interface StoreType {
  id: {
    id: string;
  };
  balance: string;
  collection_id: string;
  name: string;
  slots: Slot[];
}

export interface StoreObjectData {
  objectId: string;
  version: string;
  digest: string;
  type: string;
  content: {
    dataType: string;
    type: string;
    hasPublicTransfer: boolean;
    // fields: StoreType | MoveStruct;
    fields: StoreType;
  };
}

export interface StoreData {
  id: string;
  objectData: StoreObjectData;
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
