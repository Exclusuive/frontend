import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetCollection } from "@/hooks/useGetCollection";
import { MintItemDialog } from "@/components/MintItemDialog";
import { MintItemData } from "@/types/contract";
import { useSendTransactions } from "@/hooks/useSendTransactions";
export default function ManageItemNFT() {
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get("collection_id");
  const capId = searchParams.get("cap_id");
  const { collection, loading, error } = useGetCollection(collectionId || "", capId || "");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"new" | "existing">("new");
  const { mintItem } = useSendTransactions();

  // console.log(collection);

  const handleOpenDialog = (mode: "new" | "existing") => {
    setDialogMode(mode);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleMint = async (data: MintItemData) => {
    try {
      // Here you would implement the actual minting logic
      await mintItem({
        id: collectionId || "",
        capId: capId || "",
        layer: data.layer,
        itemName: data.itemName || "",
        itemImg: data.itemImage || null,
        itemImageUrl: data.itemImageUrl,
        toAddress: data.recipient,
      });
      // Simulate a successful mint
    } catch (error) {
      console.error("Error minting item:", error);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (error || !collection) {
    return (
      <div className="flex h-screen items-center justify-center">Error loading collection</div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">Manage Items for {collection.name}</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Create New Item Card */}
        <Card
          className="cursor-pointer transition-all hover:shadow-lg"
          onClick={() => handleOpenDialog("new")}
        >
          <CardHeader>
            <CardTitle>Create New Item</CardTitle>
            <CardDescription>Create a new item and mint it to a recipient</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Create a brand new item with custom name and image, then mint it to a recipient.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Create & Mint New Item</Button>
          </CardFooter>
        </Card>

        {/* Mint Existing Item Card */}
        <Card
          className="cursor-pointer transition-all hover:shadow-lg"
          onClick={() => handleOpenDialog("existing")}
        >
          <CardHeader>
            <CardTitle>Mint Existing Item</CardTitle>
            <CardDescription>Mint an existing item to a recipient</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Select an existing item from your collection and mint it to a recipient.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Mint Existing Item</Button>
          </CardFooter>
        </Card>
      </div>

      {/* Mint Item Dialog */}
      <MintItemDialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        mode={dialogMode}
        layerTypes={collection.layer_types || []}
        propertyTypes={collection.property_types || []}
        existingItems={collection.items || []}
        onMint={handleMint}
      />
    </div>
  );
}
