import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { CollectionFormData, TransactionResult, TxCall } from "@/types/contract";
import { uploadToS3 } from "@/lib/uploadToS3";
import { buildTx } from "@/lib/buildTx";
import { useToast } from "@/hooks/useToast";
import { updateCollectionIdParam } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export const useSendTransactions = () => {
  const client = useSuiClient();
  const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
  const MODULE_ID = import.meta.env.VITE_MODULE;
  const { setToastState } = useToast();
  const navigate = useNavigate();

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

  // Helper function to execute transactions with consistent error handling
  const executeTransaction = async (tx: any, chain = "sui:testnet") => {
    return new Promise((resolve, reject) => {
      signAndExecuteTransaction(
        {
          transaction: tx,
          chain: chain as `${string}:${string}`,
        },
        {
          onSuccess: (result) => {
            resolve(result);
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });
  };

  // Create a new collection with all its properties
  const newCollection = async ({ name, description, img_url, layers }: CollectionFormData) => {
    try {
      setToastState({ type: "loading", message: "Collection is being created..." });

      // Step 1: Create the collection
      const createCollectionTx = buildTx([
        {
          funcName: "default",
          args: [{ type: "string", value: name }],
        },
      ]);

      const result = await executeTransaction(createCollectionTx);

      setToastState({
        type: "success",
        message: "Creating collection succeeded.",
      });

      // Wait for toast to be visible
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setToastState({
        type: "loading",
        message:
          "Adding layers and information to the collection. Please confirm your transaction once again.",
      });

      const createdObjects = (result as TransactionResult).objectChanges?.filter(
        (obj) => obj.type === "created"
      );
      const collectionObject = createdObjects?.find((obj) =>
        obj.objectType.endsWith("::Collection")
      );
      const collectionCapObject = createdObjects?.find((obj) =>
        obj.objectType.endsWith("::CollectionCap")
      );

      if (!collectionObject?.objectId || !collectionCapObject?.objectId) {
        throw new Error("Failed to get collection objects");
      }

      // Step 2: Upload image to S3
      const uploadedUrl = await uploadToS3({
        type: `${PACKAGE_ID}_${MODULE_ID}_collection`,
        id: collectionObject.objectId,
        file: img_url,
      });

      // Step 3: Create layer transactions
      const layerTxCalls: TxCall[] = layers.map((layer) => ({
        funcName: "add_layer_type",
        args: [
          { type: "object", value: collectionObject.objectId },
          { type: "object", value: collectionCapObject.objectId },
          { type: "string", value: layer.name },
        ],
      }));

      // Step 4: Build and execute configuration transaction
      const configTx = buildTx([
        // Add description
        {
          funcName: "add_config_to_type",
          typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::BaseType`],
          args: [
            { type: "object", value: collectionObject.objectId },
            { type: "object", value: collectionCapObject.objectId },
            { type: "string", value: name },
            { type: "string", value: "description" },
            { type: "string", value: description },
          ],
        },
        // Add banner image
        {
          funcName: "add_config_to_type",
          typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::BaseType`],
          args: [
            { type: "object", value: collectionObject.objectId },
            { type: "object", value: collectionCapObject.objectId },
            { type: "string", value: name },
            { type: "string", value: "img_url" },
            { type: "string", value: uploadedUrl.fileUrl },
          ],
        },
        // Add layers
        ...layerTxCalls,
      ]);

      await executeTransaction(configTx);

      setToastState({
        type: "success",
        message: "Done! Please return to the dashboard.",
      });
      updateCollectionIdParam(
        collectionObject.objectId,
        new URLSearchParams(window.location.search),
        window.location,
        navigate
      );

      return { success: true };
    } catch (error) {
      setToastState({
        type: "error",
        message: "Something went wrong while creating the collection. Please try again.",
      });
      return { success: false, error };
    }
  };

  return {
    newCollection,
  };
};
