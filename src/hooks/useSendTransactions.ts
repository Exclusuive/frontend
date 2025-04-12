import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { CollectionFormData, MintItemProps, TransactionResult, TxCall } from "@/types/contract";
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
          { type: "object" as const, value: collectionObject.objectId },
          { type: "object" as const, value: collectionCapObject.objectId },
          { type: "string" as const, value: layer.name },
        ],
      }));

      // Step 4: Build and execute configuration transaction
      const configTx = buildTx([
        // Add description
        {
          funcName: "add_config_to_type",
          typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::BaseType`],
          args: [
            { type: "object" as const, value: collectionObject.objectId },
            { type: "object" as const, value: collectionCapObject.objectId },
            { type: "string" as const, value: name },
            { type: "string" as const, value: "description" },
            { type: "string" as const, value: description },
          ],
        },
        // Add banner image
        {
          funcName: "add_config_to_type",
          typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::BaseType`],
          args: [
            { type: "object" as const, value: collectionObject.objectId },
            { type: "object" as const, value: collectionCapObject.objectId },
            { type: "string" as const, value: name },
            { type: "string" as const, value: "img_url" },
            { type: "string" as const, value: uploadedUrl.fileUrl },
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
        collectionCapObject.objectId,
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

  const mintItem = async ({
    id,
    capId,
    layer,
    itemName,
    itemImg,
    itemImageUrl,
    toAddress,
  }: MintItemProps) => {
    try {
      setToastState({ type: "loading", message: "Minting Item Object..." });

      let imageUrl = itemImageUrl;

      // Only upload to S3 if we have a new image file
      if (itemImg) {
        const uploadedUrl = await uploadToS3({
          type: `${PACKAGE_ID}_${MODULE_ID}_collection/item/${id}`,
          id: itemName,
          file: itemImg,
        });
        imageUrl = uploadedUrl.fileUrl;
      }

      console.log(id, capId, layer, itemName, itemImg, itemImageUrl, toAddress);

      if (!imageUrl) {
        throw new Error("No image URL provided for minting");
      }

      const tx = buildTx([
        {
          funcName: "mint_item",
          args: [
            { type: "object" as const, value: id },
            { type: "object" as const, value: capId },
            { type: "string" as const, value: layer },
            { type: "string" as const, value: itemName },
            { type: "string" as const, value: imageUrl },
            { type: "object" as const, value: toAddress },
          ],
        },
      ]);

      const result = await executeTransaction(tx);

      setToastState({ type: "success", message: "Minting Item Object succeeded" });

      return { success: true, result };
    } catch (error) {
      setToastState({
        type: "error",
        message: "Minting Item Object failed. Please try again.",
      });
      return { success: false, error };
    }
  };

  // Update collection information (description and image)
  const updateCollectionInfo = async ({
    id,
    capId,
    collectionName,
    description,
    img,
  }: {
    id: string;
    capId: string;
    collectionName: string;
    description: string;
    img: File | null;
  }) => {
    try {
      setToastState({ type: "loading", message: "Updating collection information..." });
      // Only upload to S3 if we have a new image file
      if (img) {
        await uploadToS3({
          type: `${PACKAGE_ID}_${MODULE_ID}_collection`,
          id: id,
          file: img,
        });
      }

      const tx = buildTx([
        // Update description
        {
          funcName: "update_config_to_type",
          typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::BaseType`],
          args: [
            { type: "object" as const, value: id },
            { type: "object" as const, value: capId },
            { type: "string" as const, value: collectionName },
            { type: "string" as const, value: "description" },
            { type: "string" as const, value: description },
          ],
        },
      ]);

      await executeTransaction(tx);

      setToastState({ type: "success", message: "Collection information updated successfully" });

      return { success: true };
    } catch (error) {
      setToastState({
        type: "error",
        message: "Failed to update collection information. Please try again.",
      });
      return { success: false, error };
    }
  };

  // Add a new layer to the collection
  const addLayer = async ({
    id,
    capId,
    layerName,
  }: {
    id: string;
    capId: string;
    layerName: string;
  }) => {
    try {
      setToastState({ type: "loading", message: "Adding new layer..." });

      const tx = buildTx([
        {
          funcName: "add_layer_type",
          args: [
            { type: "object" as const, value: id },
            { type: "object" as const, value: capId },
            { type: "string" as const, value: layerName },
          ],
        },
      ]);

      await executeTransaction(tx);

      setToastState({ type: "success", message: "Layer added successfully" });

      return { success: true };
    } catch (error) {
      setToastState({
        type: "error",
        message: "Failed to add layer. Please try again.",
      });
      return { success: false, error };
    }
  };

  // Reorder layers in the collection
  const reorderLayers = async ({
    id,
    capId,
    layers,
  }: {
    id: string;
    capId: string;
    layers: string[];
  }) => {
    try {
      setToastState({ type: "loading", message: "Reordering layers..." });

      const tx = buildTx([
        {
          funcName: "reorder_layers",
          args: [
            { type: "object" as const, value: id },
            { type: "object" as const, value: capId },
            { type: "variable" as const, value: JSON.stringify(layers) },
          ],
        },
      ]);

      await executeTransaction(tx);

      setToastState({ type: "success", message: "Layers reordered successfully" });

      return { success: true };
    } catch (error) {
      setToastState({
        type: "error",
        message: "Failed to reorder layers. Please try again.",
      });
      return { success: false, error };
    }
  };

  // Add a new property type to the collection
  const addPropertyType = async ({
    id,
    capId,
    propertyType,
  }: {
    id: string;
    capId: string;
    propertyType: string;
  }) => {
    try {
      setToastState({ type: "loading", message: "Adding new property type..." });

      const tx = buildTx([
        {
          funcName: "add_property_type",
          args: [
            { type: "object" as const, value: id },
            { type: "object" as const, value: capId },
            { type: "string" as const, value: propertyType },
          ],
        },
      ]);

      await executeTransaction(tx);

      setToastState({ type: "success", message: "Property type added successfully" });

      return { success: true };
    } catch (error) {
      setToastState({
        type: "error",
        message: "Failed to add property type. Please try again.",
      });
      return { success: false, error };
    }
  };

  // Add a new supplier to the collection
  const addSupplier = async ({
    id,
    capId,
    supplier,
  }: {
    id: string;
    capId: string;
    supplier: string;
  }) => {
    try {
      setToastState({ type: "loading", message: "Adding new supplier..." });

      const tx = buildTx([
        {
          funcName: "create_supplier",
          args: [
            { type: "object" as const, value: id },
            { type: "object" as const, value: capId },
            { type: "string" as const, value: supplier },
          ],
        },
      ]);

      await executeTransaction(tx);

      setToastState({ type: "success", message: "Supplier added successfully" });

      return { success: true };
    } catch (error) {
      setToastState({
        type: "error",
        message: "Failed to add supplier. Please try again.",
      });
      return { success: false, error };
    }
  };

  // Add a new ticket type to the collection
  const addTicketType = async ({
    id,
    capId,
    ticketType,
  }: {
    id: string;
    capId: string;
    ticketType: string;
  }) => {
    try {
      setToastState({ type: "loading", message: "Adding new ticket type..." });

      const tx = buildTx([
        {
          funcName: "add_ticket_type",
          args: [
            { type: "object" as const, value: id },
            { type: "object" as const, value: capId },
            { type: "string" as const, value: ticketType },
          ],
        },
      ]);

      await executeTransaction(tx);

      setToastState({ type: "success", message: "Ticket type added successfully" });

      return { success: true };
    } catch (error) {
      setToastState({
        type: "error",
        message: "Failed to add ticket type. Please try again.",
      });
      return { success: false, error };
    }
  };

  return {
    newCollection,
    mintItem,
    updateCollectionInfo,
    addLayer,
    reorderLayers,
    addPropertyType,
    addSupplier,
    addTicketType,
  };
};
