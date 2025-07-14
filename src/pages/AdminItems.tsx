import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useCollectionStore } from "@/stores/useCollectionStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import AddItem, { ItemCreateFormData } from "@/components/AddItem";
import ItemsbyCategory from "@/components/ItemsbyCategory";
import { formatItemAttributes, getItemsByLayer } from "@/lib/items";
import { Attribute, Item } from "@/types/collection";
import { useAddItemType, useMintItem } from "exclusuive-typescript-sdk";
import { toast } from "sonner";

const AdminItems = () => {
  const { collection, setCollection } = useCollectionStore();
  const { addItemType, isPending, error, result } = useAddItemType();
  const { mintItem, isPending: isMinting, error: mintError, result: mintResult } = useMintItem();

  if (!collection) {
    return (
      <div className="flex flex-col gap-4 p-10">
        <Card>
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <p className="mb-2 text-lg font-medium text-gray-600">No Collection Selected</p>
              <p className="text-sm text-gray-500">
                Please select a collection to view its items by layers.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const layers = collection.layer_types || [];
  const items: Item[] = collection.item_types || [];

  const [mintAddress, setMintAddress] = useState("");
  const [open, setOpen] = useState(false);
  const onMintAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintAddress(e.target.value);
  };

  const onMint = (name: string, layer: string, attributes: Attribute[] | string) => {
    mintItem({
      col: collection.id,
      cap: collection.cap || "",
      layer: layer,
      name: name,
      attributes: attributes,
      recipient: mintAddress,
    });
  };
  const onSubmit = (data: ItemCreateFormData) => {
    addItemType({
      col: collection.id,
      cap: collection.cap || "",
      layer: data.layer,
      name: data.name,
      img_url: data.imgUrl,
      description: data.description,
      attributes: data.attributes,
    });
  };

  useEffect(() => {
    if (isPending) {
      toast.loading("Item is being created...");
    }
    if (result) {
      toast.dismiss();
      toast.success("Item created successfully");

      setCollection({
        ...collection,
        item_types: [...(collection.item_types || []), result],
      });
      setOpen(false);
    } else if (error) {
      toast.dismiss();
      toast.error("Failed to create item");
    }
  }, [isPending, result, error]);

  useEffect(() => {
    if (isMinting) {
      toast.loading("Minting item...");
    }
    if (mintResult) {
      toast.dismiss();
      toast.success("Item minted successfully");
    } else if (mintError) {
      toast.dismiss();
      toast.error("Failed to mint item");
    }
  }, [isMinting, mintResult, mintError]);

  // Render items grid component
  const renderItemsGrid = (layer: string, items: Item[]) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{layer}</h3>
        <Badge variant="secondary"> {getItemsByLayer(items, layer).length} items</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {getItemsByLayer(items, layer).length > 0 &&
          getItemsByLayer(items, layer).map((item: Item, index: number) => (
            <div key={`${item.name}-${index}`} className="rounded-lg border p-4">
              <div className="mb-3 aspect-square">
                <img
                  src={item.img_url}
                  alt={item.name}
                  className="h-full w-full rounded-md object-cover"
                />
              </div>
              <h4 className="mb-1 text-sm font-medium">
                {item.name}{" "}
                <a
                  href={`https://suiscan.xyz/address/${item.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  view on Explorer
                </a>
              </h4>
              <p className="mb-1 truncate text-xs text-gray-500">{item.description}</p>
              <p className="my-2 flex flex-wrap gap-2">
                {formatItemAttributes(item.attributes || []).map((attribute) => (
                  <Badge key={attribute.name} variant="secondary" className="text-xs">
                    {attribute.name}: {attribute.value}
                  </Badge>
                ))}
              </p>

              <div className="mt-auto flex items-center justify-center gap-2 md:flex-row">
                <Input
                  onChange={onMintAddressChange}
                  placeholder="Enter Member address"
                  value={mintAddress}
                />
                <Button
                  onClick={() => onMint(item.name, item.layer, item.attributes || "")}
                  className="w-fit bg-blue-600 hover:bg-blue-700"
                  disabled={!mintAddress}
                >
                  Mint
                </Button>
              </div>
            </div>
          ))}

        {/* Add New Item Button */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <div className="flex min-h-[300px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-blue-300 p-4 transition-colors hover:border-blue-400 hover:bg-blue-50">
              <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-blue-600 hover:text-blue-800">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl font-light text-blue-500">
                  +
                </div>
                <span className="text-sm font-medium">Add New Item</span>
              </div>
            </div>
          </DialogTrigger>
          <AddItem category={layer} onSubmit={onSubmit} collection={collection} />
        </Dialog>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-10">
      <Card className="mx-auto w-full lg:w-2/3">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Items by Layer</CardTitle>
          <p className="text-sm text-gray-600">Collection: {collection.name}</p>
        </CardHeader>
        <ItemsbyCategory
          categories={layers}
          items={items}
          getItemsByCategory={getItemsByLayer}
          renderItemsGrid={renderItemsGrid}
        />
      </Card>
    </div>
  );
};

export default AdminItems;
