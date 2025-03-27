<<<<<<< HEAD
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
=======
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery } from "@mysten/dapp-kit";
>>>>>>> c9fb3fb7f2936775f53961287487ad766e8431c6
import { buildTx } from "@/lib/buildTx";
import {
  AddInfoProps,
  AddLayerProps,
  CreateCollectionProps,
  NewCollectionProps,
  TxCall,
} from "@/types/types";
import { useState } from "react";
import { uploadToS3 } from "@/lib/uploadToS3";

export const useSendTransactions = () => {
  const client = useSuiClient();
  const [result, setResult] = useState<any>();
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<any>();

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

  const createCollection = async ({ collectionName }: CreateCollectionProps) => {
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

  const addCollectionInfo = async ({ id, capId, name, content }: AddInfoProps) => {
    const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
    const MODULE_ID = import.meta.env.VITE_MODULE;

    const tx = buildTx([
      {
        funcName: "add_config_to_type",
        typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::BaseType`],
        args: [
          { type: "object", value: id },
          { type: "object", value: capId },
          { type: "string", value: name },
          { type: "string", value: content },
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

  const addLayerType = async ({ id, capId, name, order }: AddLayerProps) => {
    const tx = buildTx([
      {
        funcName: "add_layer_type",
        args: [
          { type: "object", value: id },
          { type: "object", value: capId },
          { type: "string", value: name },
          { type: "u64", value: order },
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

  const newCollection = async ({
    collectionName,
    description,
    bannerImageFile,
    layers,
  }: NewCollectionProps) => {
    const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
    const MODULE_ID = import.meta.env.VITE_MODULE;

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
          const createdObjects = result.objectChanges?.filter((obj) => obj.type === "created");
          const collectionObject = createdObjects!.find((obj) =>
            obj.objectType.endsWith("::Collection")
          );

          // CollectionCap 객체 찾기
          const collectionCapObject = createdObjects!.find((obj) =>
            obj.objectType.endsWith("::CollectionCap")
          );

          const layerTxCalls: TxCall[] = layers.map((layer, index) => ({
            funcName: "add_layer_type",
            args: [
              { type: "object", value: collectionObject?.objectId! },
              { type: "object", value: collectionCapObject?.objectId! },
              { type: "string", value: layer.name },
              { type: "u64", value: index },
            ],
          }));

          const uploadedUrl = await uploadToS3({
            type: `${PACKAGE_ID}_${MODULE_ID}_collection`,
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
                console.log("DONE!");
              },
              onError: () => {
                console.log("SOMETHING WRONG WITH ADD CONFIG");
              },
            }
          );

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

  return {
    addLayerType,
    createCollection,
    addCollectionInfo,
    newCollection,
  };
};
