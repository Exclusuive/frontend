import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { CollectionFormData, MintItemProps, TransactionResult, TxCall } from "@/types/contract";
import { syncImg, uploadToS3 } from "@/lib/uploadToS3";
import { buildTx } from "@/lib/buildTx";
import { useToast } from "@/hooks/useToast";
import { updateCollectionIdParam } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

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
    properties,
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

      if (!imageUrl) {
        throw new Error("No image URL provided for minting");
      }

      let propertiesTxCalls: TxCall[] = [];
      if (properties) {
        propertiesTxCalls = properties
          .map((property, index) => [
            {
              funcName: "new_property",
              args: [
                { type: "object" as const, value: id },
                { type: "object" as const, value: capId },
                { type: "string" as const, value: property.type },
                { type: "u64" as const, value: property.value },
              ],
              assign: `propertyId${index}`,
            },
            {
              funcName: "attach_property_to_item",
              args: [
                { type: "object" as const, value: id },
                { type: "variable" as const, value: "itemId" },
                { type: "variable" as const, value: `propertyId${index}` },
              ],
            },
          ])
          .flat();
      }

      const tx = buildTx([
        {
          funcName: "new_item",
          args: [
            { type: "object" as const, value: id },
            { type: "object" as const, value: capId },
            { type: "string" as const, value: layer },
            { type: "string" as const, value: itemName },
            { type: "string" as const, value: imageUrl },
          ],
          assign: "itemId",
        },
        ...propertiesTxCalls,
        {
          funcName: "transfer",
          args: [
            { type: "variable" as const, value: "itemId" },
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
      console.log(error);
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

  const mintBase = async ({
    id,
    capId,
    recipient,
  }: {
    id: string;
    capId: string;
    recipient: string;
  }) => {
    try {
      setToastState({ type: "loading", message: "Minting base NFT..." });

      const uuid = uuidv4();

      const res = await fetch("/white.png");
      const blob = await res.blob();
      const whitefile = new File([blob], "base.png", { type: "image/png" });

      const uploadedUrl = await uploadToS3({
        type: `${PACKAGE_ID}_${MODULE_ID}_collection/base`,
        id: `${uuid}`,
        file: whitefile,
      });

      console.log(uploadedUrl);

      const tx = buildTx([
        {
          funcName: "mint_and_tranfer_base",
          args: [
            { type: "object" as const, value: id },
            { type: "object" as const, value: capId },
            { type: "string" as const, value: uploadedUrl.fileUrl },
            { type: "object" as const, value: recipient },
          ],
        },
      ]);

      await executeTransaction(tx);

      setToastState({ type: "success", message: "Base NFT minted successfully" });

      return { success: true };
    } catch (error) {
      setToastState({
        type: "error",
        message: "Failed to mint base NFT. Please try again.",
      });
      return { success: false, error };
    }
  };

  const addSelection = async ({
    id,
    supplierCapId,
    supplierId,
    price,
    selectionType,
  }: {
    id: string;
    supplierCapId: string;
    supplierId: string;
    price: number;
    selectionType: string;
  }) => {
    try {
      setToastState({ type: "loading", message: "Adding new selection..." });

      console.log(id, supplierId, supplierCapId, price, selectionType);

      const tx = buildTx([
        {
          funcName: "add_selection_to_supplier",
          typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::${selectionType}`],
          args: [
            { type: "object" as const, value: id },
            { type: "object" as const, value: supplierId },
            { type: "object" as const, value: supplierCapId },
            { type: "u64" as const, value: price },
          ],
        },
      ]);

      await executeTransaction(tx);

      setToastState({ type: "success", message: "Selection added successfully" });

      return { success: true };
    } catch (error) {
      setToastState({
        type: "error",
        message: "Failed to add selection. Please try again.",
      });
      return { success: false, error };
    }
  };

  const addCondition = async ({
    id,
    supplierId,
    supplierCapId,
    ticketType,
    requirements,
    selectionNumber,
  }: {
    id: string;
    supplierId: string;
    supplierCapId: string;
    ticketType: string;
    requirements: number;
    selectionNumber: number;
  }) => {
    try {
      setToastState({ type: "loading", message: "Adding new condition..." });

      const tx = buildTx([
        {
          funcName: "add_condition_to_selection",
          args: [
            { type: "object" as const, value: id },
            { type: "object" as const, value: supplierId },
            { type: "object" as const, value: supplierCapId },
            { type: "u64" as const, value: selectionNumber },
            { type: "string" as const, value: ticketType },
            { type: "u64" as const, value: requirements },
          ],
        },
      ]);

      await executeTransaction(tx);

      setToastState({ type: "success", message: "Condition added successfully" });

      return { success: true };
    } catch (error) {
      console.log(error);
      setToastState({
        type: "error",
        message: "Failed to add condition. Please try again.",
      });
      return { success: false, error };
    }
  };

  const addProduct = async ({
    id,
    capId,
    supplierId,
    supplierCapId,
    selectionNumber,
    productType,
    quantity,
    // Item specific parameters
    layer,
    itemName,
    img_url,
    // Property specific parameters
    propertyName,
    propertyValue,
    // Ticket specific parameters
    ticketName,
  }: {
    id: string;
    capId: string;
    supplierId: string;
    supplierCapId: string;
    selectionNumber: number;
    productType: "Item" | "Property" | "Ticket";
    quantity: number;
    // Item specific parameters
    layer?: string;
    itemName?: string;
    img_url?: string;
    // Property specific parameters
    propertyName?: string;
    propertyValue?: string;
    // Ticket specific parameters
    ticketName?: string;
  }) => {
    try {
      setToastState({ type: "loading", message: "Adding product to selection..." });

      // Prepare the transaction calls array
      const txCalls: TxCall[] = [];

      // Validate required parameters based on product type
      if (productType === "Item") {
        if (!layer || !itemName) {
          throw new Error("Layer and itemName are required for Item type");
        }
      } else if (productType === "Property") {
        if (!propertyName || !propertyValue) {
          throw new Error("propertyName and propertyValue are required for Property type");
        }
      } else if (productType === "Ticket") {
        if (!ticketName) {
          throw new Error("ticketName is required for Ticket type");
        }
      }

      // Create products and add them to the supplier
      for (let i = 0; i < quantity; i++) {
        // Variable name to store the created product ID for this iteration
        const productIdVar = `productId${i}`;

        // Create the product based on productType
        if (productType === "Item" && layer && itemName) {
          // Create new item and assign the result to a variable
          txCalls.push({
            funcName: "new_item",
            assign: productIdVar,
            args: [
              { type: "object" as const, value: id },
              { type: "object" as const, value: capId },
              { type: "string" as const, value: layer },
              { type: "string" as const, value: itemName },
              { type: "string" as const, value: img_url || "" },
            ],
          });
        } else if (productType === "Property" && propertyName && propertyValue) {
          // Create new property and assign the result to a variable
          txCalls.push({
            funcName: "new_property",
            assign: productIdVar,
            args: [
              { type: "object" as const, value: id },
              { type: "object" as const, value: capId },
              { type: "string" as const, value: propertyName },
              { type: "u64" as const, value: propertyValue },
            ],
          });
        } else if (productType === "Ticket" && ticketName) {
          // Create new ticket and assign the result to a variable
          txCalls.push({
            funcName: "new_ticket",
            assign: productIdVar,
            args: [
              { type: "object" as const, value: id },
              { type: "object" as const, value: capId },
              { type: "string" as const, value: ticketName },
            ],
          });
        }

        // Add the product to the supplier
        txCalls.push({
          funcName: "add_product_to_supplier",
          typeArguments: [`${PACKAGE_ID}::${MODULE_ID}::${productType}`],
          args: [
            { type: "object" as const, value: id },
            { type: "object" as const, value: supplierId },
            { type: "object" as const, value: supplierCapId },
            { type: "u64" as const, value: selectionNumber },
            { type: "variable" as const, value: productIdVar },
          ],
        });
      }

      // Execute all transactions in a single call
      const tx = buildTx(txCalls);
      const result = await executeTransaction(tx);

      // Extract the created product IDs from the result
      const createdObjects = (result as TransactionResult).objectChanges?.filter(
        (obj) => obj.type === "created"
      );
      const productObjects = createdObjects?.filter((obj) =>
        obj.objectType.endsWith(`::${productType}`)
      );

      const productIds = productObjects?.map((obj) => obj.objectId) || [];

      setToastState({ type: "success", message: "Products added successfully" });

      return { success: true, productIds };
    } catch (error) {
      setToastState({
        type: "error",
        message: "Failed to add products. Please try again.",
      });
      return { success: false, error };
    }
  };

  const equipItem = async ({
    id,
    baseId,
    itemId,
  }: {
    id: string;
    baseId: string;
    itemId: string;
  }) => {
    try {
      setToastState({ type: "loading", message: "Equipping item..." });

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

      await executeTransaction(tx);

      syncImg(baseId);

      setToastState({ type: "success", message: "Item equipped successfully" });

      return { success: true };
    } catch (error) {
      console.log(error);
      setToastState({
        type: "error",
        message: "Failed to equip item. Please try again.",
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
    mintBase,
    addSelection,
    addCondition,
    addProduct,
    equipItem,
  };
};
