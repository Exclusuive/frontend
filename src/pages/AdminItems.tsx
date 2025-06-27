import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCollectionStore } from "@/stores/useCollectionStore";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import AddItem from "@/components/AddItem";

const AdminItems = () => {
  const { collection } = useCollectionStore();

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

  const layers = collection.layers || [];
  const items = collection.items || [];

  // Filter items by layer
  const getItemsByLayer = (layerName: string) => {
    return items.filter((item) => item.layer === layerName);
  };

  const [mintAddress, setMintAddress] = useState("");
  const [open, setOpen] = useState(false);
  const onMintAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMintAddress(e.target.value);
  };

  const onMint = () => {
    console.log(mintAddress);
  };

  // Render items grid component
  const renderItemsGrid = (layer: string) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{layer}</h3>
        <Badge variant="secondary">{getItemsByLayer(layer).length} items</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
        {getItemsByLayer(layer).length > 0 &&
          getItemsByLayer(layer).map((item, index) => (
            <div key={`${item.name}-${index}`} className="rounded-lg border p-4">
              <div className="mb-3 aspect-square">
                <img
                  src={item.imgUrl}
                  alt={item.name}
                  className="h-full w-full rounded-md object-cover"
                />
              </div>
              <h4 className="mb-1 text-sm font-medium">{item.name}</h4>
              <p className="mb-1 truncate text-xs text-gray-500">{item.description}</p>
              <p className="flex flex-wrap gap-2">
                {item.properties?.map((property) => (
                  <Badge key={property.name} variant="secondary">
                    {property.name}: {property.value}
                  </Badge>
                ))}
              </p>
              <a
                href={`https://suiscan.xyz/address/${item.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-600"
              >
                view on Explorer
              </a>
              <div className="mt-auto flex items-center justify-center gap-2 md:flex-row">
                <Input
                  onChange={onMintAddressChange}
                  placeholder="Enter Member address"
                  value={mintAddress}
                />
                <Button
                  onClick={onMint}
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
          <AddItem layer={layer} onOpenChange={setOpen} />
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
        <CardContent>
          {layers.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">No layers defined for this collection.</p>
            </div>
          ) : (
            <>
              <div className="block xl:hidden">
                <Accordion type="single" collapsible defaultValue={layers[0]}>
                  {layers.map((layer) => (
                    <AccordionItem key={layer} value={layer}>
                      <AccordionTrigger className="cursor-pointer px-4 py-3 text-left">
                        <div className="flex w-full items-center justify-between">
                          <span className="font-medium">{layer}</span>
                          <Badge variant="secondary">{getItemsByLayer(layer).length}</Badge>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">{renderItemsGrid(layer)}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>

              <div className="hidden xl:block">
                <Tabs defaultValue={layers[0]} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
                    {layers.map((layer) => (
                      <TabsTrigger key={layer} value={layer} className="text-sm">
                        {layer}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {layers.map((layer) => (
                    <TabsContent key={layer} value={layer} className="mt-6">
                      {renderItemsGrid(layer)}
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminItems;
