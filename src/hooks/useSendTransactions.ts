import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { buildTx } from "@/lib/buildTx";
import {
  AddItemProps,
  MintBaseProps,
  MintItemProps,
  NewCollectionProps,
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
              { type: "string", value: layer.name! },
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
                { type: "string", value: "BaseType" },
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
                { type: "string", value: "BaseType" },
                { type: "string", value: "bannerImg" },
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

  const addItemType = async ({ id, capId, layer, itemName, itemImg }: AddItemProps) => {
    setIsPending(true);

    const uploadedUrl = await uploadToS3({
      type: `${PACKAGE_ID}_${MODULE_ID}_collection/item/${id}`,
      id: itemName,
      file: itemImg,
    });

    const tx = buildTx([
      {
        funcName: "add_item_type",
        args: [
          { type: "object", value: id },
          { type: "object", value: capId },
          { type: "string", value: layer },
          { type: "string", value: itemName },
          { type: "string", value: uploadedUrl.fileUrl },
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
          setIsPending(false);
          setResult(result);
        },
        onError(error) {
          setIsPending(false);
          setError(error);
        },
      }
    );
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

  const mintItem = async ({ id, capId, baseId, itemType }: MintItemProps) => {
    setIsPending(true);

    const tx = buildTx([
      {
        assign: "TYPE",
        value: { type: "string", value: itemType }, // ⬅️ move-call 없이 assign만
      },
      {
        funcName: "new_item",
        args: [
          { type: "object", value: id },
          { type: "object", value: capId },
          { type: "variable", value: "TYPE" },
        ],
        assign: "ITEM",
      },
      {
        funcName: "equip_item_to_base",
        args: [
          { type: "object", value: id },
          { type: "object", value: baseId },
          { type: "variable", value: "ITEM" },
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
          setIsPending(false);
          setResult(result);
        },
        onError: (error) => {
          setIsPending(false);
          setError(error);
        },
      }
    );

    await syncImg(baseId);

    return { result, isPending, error };
  };

  return {
    addLayerType,
    // createCollection,
    // addCollectionInfo,
    newCollection,
    addItemType,
    mintBase,
    mintItem,
  };
};
