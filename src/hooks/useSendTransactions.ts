import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { buildTx } from "@/lib/buildTx";
import {
  AddCollectionTypeProps,
  AddSelectionProps,
  CreateSupplierProps,
  EditCollectionProps,
  EditLayerProps,
  EquipItemProps,
  GivePropertyProps,
  MintBaseProps,
  MintItemProps,
  NewCollectionProps,
  TxArg,
  TxCall,
} from "@/types/types";
import { useEffect, useRef, useState } from "react";
import { syncImg, uploadToS3 } from "@/lib/uploadToS3";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner"; // ✅ 일반 함수 import

export const useSendTransactions = () => {
  const client = useSuiClient();
  const [result, setResult] = useState<any>();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [error, setError] = useState<any>();
  const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
  const MODULE_ID = import.meta.env.VITE_MODULE;
  const toastIdRef = useRef<any | null>(null);

  const [toastState, setToastState] = useState<{
    type: "loading" | "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    if (!toastState.type || !toastState.message) return;

    if (toastState.type === "loading") {
      toastIdRef.current = toast.loading(toastState.message);
    } else if (toastState.type === "success" && toastIdRef.current !== null) {
      toast.success(toastState.message, { id: toastIdRef.current });
      toastIdRef.current = null;
    } else if (toastState.type === "error" && toastIdRef.current !== null) {
      toast.error(toastState.message, { id: toastIdRef.current });
      toastIdRef.current = null;
    }

    // 상태 초기화
    setToastState({ type: null, message: "" });
  }, [toastState]);

  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await client.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showObjectChanges: true,
        },
      }),
  });

  //   const createCollection = async ({ collectionName }: CreateCollectionProps) => {
  //     const tx = buildTx([
  //       {
  //         funcName: "default",
  //         args: [{ type: "string", value: collectionName }],
  //       },
  //     ]);

  //     signAndExecuteTransaction(
  //       {
  //         transaction: tx,
  //         chain: "sui:testnet",
  //       },
  //       {
  //         onSuccess: async (result) => {
  //           setIsPending(false);
  //           setResult(result);
  //         },
  //         onError(error) {
  //           setIsPending(false);
  //           setError(error);
  //         },
  //       }
  //     );
  //     return { result, isPending, error };
  //   };

  //   const addCollectionInfo = async ({ id, capId, name, content }: AddInfoProps) => {
  //     const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
  //     const MODULE_ID = import.meta.env.VITE_MODULE;

  //     const tx = buildTx([
  //       {
  //         funcName: "add_config_to_type",
  //         typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::BaseType`],
  //         args: [
  //           { type: "object", value: id },
  //           { type: "object", value: capId },
  //           { type: "string", value: name },
  //           { type: "string", value: content },
  //         ],
  //       },
  //     ]);

  //     signAndExecuteTransaction(
  //       {
  //         transaction: tx,
  //         chain: "sui:testnet",
  //       },
  //       {
  //         onSuccess: async (result) => {
  //           setIsPending(false);
  //           setResult(result);
  //         },
  //         onError(error) {
  //           setIsPending(false);
  //           setError(error);
  //         },
  //       }
  //     );
  //     return { result, isPending, error };
  //   };

  //   const addLayerType = async ({ id, capId, name, order }: AddLayerProps) => {
  //     const tx = buildTx([
  //       {
  //         funcName: "add_layer_type",
  //         args: [
  //           { type: "object", value: id },
  //           { type: "object", value: capId },
  //           { type: "string", value: name },
  //           { type: "u64", value: order },
  //         ],
  //       },
  //     ]);

  //     signAndExecuteTransaction(
  //       {
  //         transaction: tx,
  //         chain: "sui:testnet",
  //       },
  //       {
  //         onSuccess: async (result) => {
  //           setIsPending(false);
  //           setResult(result);
  //         },
  //         onError(error) {
  //           setIsPending(false);
  //           setError(error);
  //         },
  //       }
  //     );
  //     return { result, isPending, error };
  //   };

  //   const newCollection = async ({
  //     collectionName,
  //     description,
  //     bannerImageFile,
  //     layers,
  //   }: NewCollectionProps) => {
  //     const tx = buildTx([
  //       {
  //         funcName: "default",
  //         args: [{ type: "string", value: collectionName }],
  //       },
  //     ]);

  //     signAndExecuteTransaction(
  //       {
  //         transaction: tx,
  //         chain: "sui:testnet",
  //       },
  //       {
  //         onSuccess: async (result) => {
  //           const createdObjects = result.objectChanges?.filter((obj) => obj.type === "created");
  //           const collectionObject = createdObjects!.find((obj) =>
  //             obj.objectType.endsWith("::Collection")
  //           );

  //           // CollectionCap 객체 찾기
  //           const collectionCapObject = createdObjects!.find((obj) =>
  //             obj.objectType.endsWith("::CollectionCap")
  //           );

  //           const layerTxCalls: TxCall[] = layers.map((layer, index) => ({
  //             funcName: "add_layer_type",
  //             args: [
  //               { type: "object", value: collectionObject?.objectId! },
  //               { type: "object", value: collectionCapObject?.objectId! },
  //               { type: "string", value: layer.name! },
  //               { type: "u64", value: index },
  //             ],
  //           }));

  //           const uploadedUrl = await uploadToS3({
  //             type: `${PACKAGE_ID}_${MODULE_ID}_collection`,
  //             id: collectionObject?.objectId!,
  //             file: bannerImageFile,
  //           });

  //           const tx = buildTx([
  //             {
  //               funcName: "add_config_to_type",
  //               typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::BaseType`],
  //               args: [
  //                 { type: "object", value: collectionObject?.objectId! },
  //                 { type: "object", value: collectionCapObject?.objectId! },
  //                 { type: "string", value: "description" },
  //                 { type: "string", value: description },
  //               ],
  //             },
  //             {
  //               funcName: "add_config_to_type",
  //               typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::BaseType`],
  //               args: [
  //                 { type: "object", value: collectionObject?.objectId! },
  //                 { type: "object", value: collectionCapObject?.objectId! },
  //                 { type: "string", value: "bannerImg" },
  //                 { type: "string", value: uploadedUrl.fileUrl },
  //               ],
  //             },
  //             ...layerTxCalls,
  //           ]);
  //           signAndExecuteTransaction(
  //             {
  //               transaction: tx,
  //               chain: "sui:testnet",
  //             },
  //             {
  //               onSuccess: () => {
  //                 console.log("DONE!");
  //               },
  //               onError: () => {
  //                 console.log("SOMETHING WRONG WITH ADD CONFIG");
  //               },
  //             }
  //           );

  //           setIsPending(false);
  //           setResult(result);
  //         },
  //         onError(error) {
  //           setIsPending(false);
  //           setError(error);
  //         },
  //       }
  //     );
  //     return { result, isPending, error };
  //   };

  const newCollection = async ({
    collectionName,
    description,
    bannerImageFile,
    layers,
    onDone,
  }: NewCollectionProps) => {
    setToastState({ type: "loading", message: "Collection is being created..." });
    const tx = buildTx([
      {
        funcName: "default",
        args: [{ type: "string", value: collectionName }],
      },
    ]);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet",
      },
      {
        onSuccess: async (result) => {
          setToastState({
            type: "success",
            message: "Creating collection succeeded.",
          });

          // ✅ 잠깐 기다렸다가 다음 로딩 띄우기 (토스트가 보여질 시간 확보)
          await new Promise((resolve) => setTimeout(resolve, 1500));

          setToastState({
            type: "loading",
            message:
              "Adding layers and information to the collection. Please confirm your transaction once again.",
          });

          const createdObjects = result.objectChanges?.filter((obj) => obj.type === "created");
          const collectionObject = createdObjects!.find((obj) =>
            obj.objectType.endsWith("::Collection")
          );

          // CollectionCap 객체 찾기
          const collectionCapObject = createdObjects!.find((obj) =>
            obj.objectType.endsWith("::CollectionCap")
          );

          const layerTxCalls: TxCall[] = layers.map((layer: any) => ({
            funcName: "add_layer_type",
            args: [
              { type: "object", value: collectionObject?.objectId! },
              { type: "object", value: collectionCapObject?.objectId! },
              { type: "string", value: layer.type! },
            ],
          }));

          const uploadedUrl = await uploadToS3({
            type: `${PACKAGE_ID}_${MODULE_ID}_collection/banner`,
            id: collectionObject?.objectId!,
            file: bannerImageFile,
          });

          const tx = buildTx([
            {
              funcName: "add_config_to_type",
              typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::BaseType`],
              args: [
                { type: "object", value: collectionObject?.objectId! },
                { type: "object", value: collectionCapObject?.objectId! },
                { type: "string", value: collectionName },
                { type: "string", value: "description" },
                { type: "string", value: description },
              ],
            },
            {
              funcName: "add_config_to_type",
              typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::BaseType`],
              args: [
                { type: "object", value: collectionObject?.objectId! },
                { type: "object", value: collectionCapObject?.objectId! },
                { type: "string", value: collectionName },
                { type: "string", value: "banner_url" },
                { type: "string", value: uploadedUrl.fileUrl },
              ],
            },
            ...layerTxCalls,
          ]);
          signAndExecuteTransaction(
            {
              transaction: tx,
              chain: "sui:testnet",
            },
            {
              onSuccess: () => {
                setToastState({
                  type: "success",
                  message: "Done! Please return to the dashboard.",
                });
                console.log("DONE!");
                if (onDone) onDone();
              },
              onError: () => {
                setToastState({
                  type: "error",
                  message:
                    "Something went wrong while adding config to the collection. Please return to the dashboard and edit your collection information again.",
                });
              },
            }
          );

          setIsPending(false);
          setResult(result);
        },

        onError(error) {
          setToastState({
            type: "error",
            message: "Something went wrong while creating the collection. Please try again.",
          });
          setIsPending(false);
          setError(error);
        },
      }
    );
    return { result, isPending, error };
  };

  const editLayerInfo = async ({ id, capId, layers }: EditLayerProps) => {
    setToastState({ type: "loading", message: "Editing Layers..." });
    const layerTxCalls: TxCall[] = layers.map((layer: any) => ({
      funcName: "add_layer_type",
      args: [
        { type: "object", value: id },
        { type: "object", value: capId },
        { type: "string", value: layer.type },
      ],
    }));

    const tx = buildTx([...layerTxCalls]);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet",
      },
      {
        onSuccess: () => {
          setToastState({
            type: "success",
            message: "Done! Please return to the dashboard.",
          });
          console.log("DONE!");
        },
        onError: () => {
          setToastState({
            type: "error",
            message:
              "Something went wrong while Editing Collection Information. Please return to the dashboard and edit your collection information again.",
          });
        },
      }
    );

    setIsPending(false);
    setResult(result);
    return { result, isPending, error };
  };

  const editCollectionInfo = async ({
    id,
    capId,
    collectionName,
    description,
    bannerImageFile,
    changedField,
  }: EditCollectionProps) => {
    setToastState({ type: "loading", message: "Editing Collection information..." });

    await uploadToS3({
      type: `${PACKAGE_ID}_${MODULE_ID}_collection/banner`,
      id: id,
      file: bannerImageFile,
    });

    const txData: TxCall[] = [];

    if (changedField === "description" || changedField === "both") {
      txData.push({
        funcName: "update_config_to_type",
        typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::BaseType`],
        args: [
          { type: "object", value: id } as TxArg,
          { type: "object", value: capId } as TxArg,
          { type: "string", value: collectionName } as TxArg,
          { type: "string", value: "description" } as TxArg,
          { type: "string", value: description } as TxArg,
        ],
      });
    }

    const tx = buildTx(txData);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet",
      },
      {
        onSuccess: () => {
          setToastState({
            type: "success",
            message: "Done! Please return to the dashboard.",
          });
          console.log("DONE!");
        },
        onError: () => {
          setToastState({
            type: "error",
            message:
              "Something went wrong while Editing Collection Information. Please return to the dashboard and edit your collection information again.",
          });
        },
      }
    );

    setIsPending(false);
    setResult(result);
    return { result, isPending, error };
  };

  const mintBase = async ({ id, capId, toAddress }: MintBaseProps) => {
    setIsPending(true);
    setToastState({ type: "loading", message: "Minting Base Object..." });

    const uuid = uuidv4();

    const res = await fetch("/white.png");
    const blob = await res.blob();
    const whitefile = new File([blob], "base.png", { type: "image/png" });

    const uploadedUrl = await uploadToS3({
      type: `${PACKAGE_ID}_${MODULE_ID}_collection/base`,
      id: `${uuid}`,
      file: whitefile,
    });

    const tx = buildTx([
      {
        funcName: "mint_and_tranfer_base",
        args: [
          { type: "object", value: id },
          { type: "object", value: capId },
          { type: "string", value: uploadedUrl.fileUrl },
          { type: "object", value: toAddress },
        ],
      },
    ]);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet",
      },
      {
        onSuccess: async (result) => {
          setToastState({ type: "success", message: "Minting Base Object succeded" });

          setIsPending(false);
          setResult(result);
        },
        onError(error) {
          setToastState({
            type: "error",
            message: "Something went wrong when Minting Base Object. Please Try again.",
          });

          setIsPending(false);
          setError(error);
        },
      }
    );

    return { result, isPending, error };
  };

  const mintItem = async ({ id, capId, layer, itemName, itemImg, toAddress }: MintItemProps) => {
    setIsPending(true);
    setToastState({ type: "loading", message: "Minting Item Object..." });

    const uploadedUrl = await uploadToS3({
      type: `${PACKAGE_ID}_${MODULE_ID}_collection/item/${id}`,
      id: itemName,
      file: itemImg,
    });

    const tx = buildTx([
      {
        funcName: "mint_item",
        args: [
          { type: "object", value: id },
          { type: "object", value: capId },
          { type: "string", value: layer },
          { type: "string", value: itemName },
          { type: "string", value: uploadedUrl.fileUrl },
          { type: "object", value: toAddress },
        ],
      },
    ]);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet", // 또는 mainnet
      },
      {
        onSuccess: (result) => {
          setToastState({ type: "success", message: "Minting Item Object succeded" });

          setIsPending(false);
          setResult(result);
        },
        onError: (error) => {
          setToastState({
            type: "error",
            message: "Minting Item Object failed. Please Try again.",
          });
          setIsPending(false);
          setError(error);
        },
      }
    );

    return { result, isPending, error };
  };

  const equipItem = async ({ id, baseId, itemId }: EquipItemProps) => {
    setIsPending(true);
    setToastState({ type: "loading", message: "Equip Item tto the Base" });
    const tx = buildTx([
      {
        funcName: "equip_item_to_base",
        args: [
          { type: "object", value: id },
          { type: "object", value: baseId },
          { type: "object", value: itemId },
        ],
      },
    ]);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet", // 또는 mainnet
      },
      {
        onSuccess: async (result) => {
          syncImg(baseId);
          await new Promise((resolve) => setTimeout(resolve, 1500));
          setToastState({ type: "success", message: "Equiping Item Object succeded" });
          setIsPending(false);
          setResult(result);
        },
        onError: (error) => {
          syncImg(baseId);

          setToastState({
            type: "error",
            message: "Equiping Item Object failed. Please Try again.",
          });
          console.log(error);
          setIsPending(false);
          setError(error);
        },
      }
    );

    return { result, isPending, error };
  };

  const addPropertyType = async ({ id, capId, type }: AddCollectionTypeProps) => {
    setIsPending(true);
    setToastState({ type: "loading", message: "Adding Property Type" });
    const tx = buildTx([
      {
        funcName: "add_property_type",
        args: [
          { type: "object", value: id },
          { type: "object", value: capId },
          { type: "string", value: type },
        ],
      },
    ]);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet", // 또는 mainnet
      },
      {
        onSuccess: async (result) => {
          setToastState({ type: "success", message: "Adding Property Done!" });

          setIsPending(false);
          setResult(result);
        },
        onError: (error) => {
          setToastState({
            type: "error",
            message: "Addint Property failed. Please Try again.",
          });
          console.log(error);
          setIsPending(false);
          setError(error);
        },
      }
    );

    return { result, isPending, error };
  };

  const addTicketType = async ({ id, capId, type }: AddCollectionTypeProps) => {
    setIsPending(true);
    setToastState({ type: "loading", message: "Adding Ticket Type" });
    const tx = buildTx([
      {
        funcName: "add_ticket_type",
        args: [
          { type: "object", value: id },
          { type: "object", value: capId },
          { type: "string", value: type },
        ],
      },
    ]);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet", // 또는 mainnet
      },
      {
        onSuccess: async (result) => {
          setToastState({ type: "success", message: "Adding Ticket Type Done..." });

          setIsPending(false);
          setResult(result);
        },
        onError: (error) => {
          setToastState({
            type: "error",
            message: "Adding Ticket Type Failed. Please Try again.",
          });
          console.log(error);
          setIsPending(false);
          setError(error);
        },
      }
    );

    return { result, isPending, error };
  };

  const giveProperty = async ({ id, capId, type, value }: GivePropertyProps) => {
    setIsPending(true);
    setToastState({ type: "loading", message: "Give Property" });
    const tx = buildTx([
      {
        funcName: "new_property",
        args: [
          { type: "object", value: id },
          { type: "object", value: capId },
          { type: "string", value: type },
          { type: "u64", value: value },
        ],
        assign: "PROPERTY_ID",
      },
    ]);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet", // 또는 mainnet
      },
      {
        onSuccess: async (result) => {
          setToastState({ type: "success", message: "Adding Ticket Type Done..." });

          setIsPending(false);
          setResult(result);
        },
        onError: (error) => {
          setToastState({
            type: "error",
            message: "Adding Ticket Type Failed. Please Try again.",
          });
          console.log(error);
          setIsPending(false);
          setError(error);
        },
      }
    );

    return { result, isPending, error };
  };

  const createSupplier = async ({ id, capId }: CreateSupplierProps) => {
    setIsPending(true);
    setToastState({ type: "loading", message: "Creating Supply Machine" });
    const tx = buildTx([
      {
        funcName: "create_supplyer",
        args: [
          { type: "object", value: id },
          { type: "object", value: capId },
        ],
      },
    ]);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet", // 또는 mainnet
      },
      {
        onSuccess: async (result) => {
          setToastState({ type: "success", message: "Adding Ticket Type Done..." });

          setIsPending(false);
          setResult(result);
        },
        onError: (error) => {
          setToastState({
            type: "error",
            message: "Adding Ticket Type Failed. Please Try again.",
          });
          console.log(error);
          setIsPending(false);
          setError(error);
        },
      }
    );

    return { result, isPending, error };
  };

  const addSelection = async ({
    collectionId,
    supplyId,
    supplyCapId,
    price,
  }: AddSelectionProps) => {
    setIsPending(true);
    setToastState({ type: "loading", message: "Creating Supply Machine Selection" });
    console.log(collectionId);
    const tx = buildTx([
      {
        funcName: "add_selection_to_supplyer",
        typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::Item`],
        args: [
          { type: "object", value: collectionId },
          { type: "object", value: supplyId },
          { type: "object", value: supplyCapId },
          { type: "u64", value: price },
        ],
      },
    ]);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet", // 또는 mainnet
      },
      {
        onSuccess: async (result) => {
          setToastState({ type: "success", message: "Adding Item Type Done..." });

          setIsPending(false);
          setResult(result);
        },
        onError: (error) => {
          setToastState({
            type: "error",
            message: "Adding Item Type Failed. Please Try again.",
          });
          console.log(error);
          setIsPending(false);
          setError(error);
        },
      }
    );

    return { result, isPending, error };
  };

  return {
    // addLayerType,
    // createCollection,
    // addCollectionInfo,
    addPropertyType,
    addTicketType,
    editCollectionInfo,
    editLayerInfo,
    equipItem,
    newCollection,
    mintBase,
    mintItem,
    giveProperty,
    createSupplier,
    addSelection,
  };
};
