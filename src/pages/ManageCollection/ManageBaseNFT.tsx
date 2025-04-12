import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetCollection } from "@/hooks/useGetCollection";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ManageBaseNFT() {
  const [searchParams] = useSearchParams();
  const collectionId = searchParams.get("collection_id");
  const capId = searchParams.get("cap_id");
  const { collection, loading, error } = useGetCollection(collectionId || "", capId || "");
  const { mintBase } = useSendTransactions();

  const [recipient, setRecipient] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleMintBase = async () => {
    if (!recipient) {
      return;
    }

    if (!collection) {
      return;
    }

    setIsLoading(true);

    try {
      // Use the first layer type as the base layer
      const baseLayer = collection.layer_types?.[0] || "";

      if (!baseLayer) {
        throw new Error("No base layer found in the collection");
      }

      // Mint the base NFT to the recipient
      await mintBase({
        id: collectionId || "",
        capId: capId || "",
        recipient: recipient,
      });

      // Clear the recipient input
      setRecipient("");
    } catch (error) {
      console.error("Error minting base NFT:", error);
    } finally {
      setIsLoading(false);
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
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Mint Base NFT</CardTitle>
          <CardDescription>Mint a base NFT to a recipient address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="recipient" className="text-right">
                Recipient
              </Label>
              <Input
                id="recipient"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="col-span-3"
                placeholder="Enter recipient address"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleMintBase} disabled={isLoading || !recipient} className="w-full">
            {isLoading ? "Minting..." : "Mint Base NFT"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
