import { buildTx } from "@/lib/buildTx";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { CreateProps } from "@/types/types";
import { useCollectionForm } from "@/lib/userCollectionForm";

export const useCreateCollectionTransaction = () => {
  const client = useSuiClient();
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

  const { createCollectionWithImage } = useCollectionForm();

  const createCollectionTransaction = async ({
    collectionName,
    collectionInfo,
    bannerImageFile,
  }: CreateProps) => {
    const tx = buildTx("default", [{ type: "string", value: collectionName }]);

    signAndExecuteTransaction(
      {
        transaction: tx,
        chain: "sui:testnet",
      },
      {
        onSuccess: async (result) => {
          console.log("executed transaction", result);
          const createdObjects = result.objectChanges
            ?.filter((change) => change.type === "created")
            .filter((change) => change.objectType?.split("::")[2] === "Collection");

          const objectId = createdObjects?.[0]?.objectId;
          if (objectId) {
            try {
              await createCollectionWithImage({
                id: objectId,
                name: collectionName,
                description: collectionInfo,
                imageFile: bannerImageFile || undefined,
              });
              window.alert("Create Collection complete!");
            } catch (e) {
              window.alert("Something went wrong!");
            }
          }
        },
        onError(error) {
          window.alert(error);
        },
      }
    );
  };

  return { createCollectionTransaction };
};
