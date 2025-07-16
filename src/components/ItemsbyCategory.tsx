import { CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import React, { useEffect, useState } from "react";
import { Collection, CollectionItem, Listing } from "@/types/collection";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useCreateMarket } from "@/hooks/moveCall/useCreateMarket";
import { useAddLayer } from "@/hooks/moveCall/useAddLayer";
import { useCollectionStore } from "@/stores/useCollectionStore";
import { PlusIcon } from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";

// 타입은 필요에 따라 조정하세요.
type ItemsbyCategoryProps = {
  label: string;
  categories: string[];
  items: CollectionItem[] | Listing[];
  getItemsByCategory: (
    items: CollectionItem[] | Listing[],
    category: string,
  ) => CollectionItem[] | Listing[];
  renderItemsGrid: (category: string, items: CollectionItem[] | Listing[]) => React.ReactNode;
  collection: Collection;
};

const ItemsbyCategory: React.FC<ItemsbyCategoryProps> = ({
  label,
  categories,
  items,
  getItemsByCategory,
  renderItemsGrid,
  collection,
}) => {
  const { user } = useAuthStore();
  const [addOpen, setAddOpen] = useState(false);
  const [input, setInput] = useState("");
  const { createMarket, result } = useCreateMarket();
  const { addLayer, result: layerResult } = useAddLayer();
  const { addMarketToCollection, addLayerToCollection } = useCollectionStore();

  const handleAdd = () => {
    if (label === "markets") {
      createMarket({
        collection_id: collection.collection_id,
        collection_cap_id: collection.collection_cap_id,
        name: input,
      });
    } else if (label === "layers") {
      addLayer({
        collection_id: collection.collection_id,
        collection_cap_id: collection.collection_cap_id,
        name: input,
      });
    }
    setInput("");
  };

  useEffect(() => {
    if (result) {
      addMarketToCollection(result);
      setAddOpen(false);
      setInput("");
    }
    if (layerResult) {
      addLayerToCollection(layerResult.layer_name);
      setAddOpen(false);
      setInput("");
    }
  }, [result, layerResult]);

  return (
    <CardContent>
      {categories.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-gray-500">No {label} defined for this collection.</p>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild>
              <div className="mx-auto my-2 flex w-fit items-center justify-center rounded-xl border px-4 py-2">
                add {label}
              </div>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add {label}</DialogTitle>
              </DialogHeader>
              <DialogFooter>
                <Input
                  type="text"
                  placeholder={`Enter ${label}`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <Button variant="outline" onClick={handleAdd}>
                  Add
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <>
          <div className="block xl:hidden">
            <Accordion type="single" collapsible defaultValue={categories[0]}>
              {categories.map((category) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="cursor-pointer px-4 py-3 text-left">
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium">{category}</span>
                      <Badge variant="secondary">
                        {getItemsByCategory(items, category).length}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {renderItemsGrid(category, items)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="hidden xl:block">
            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList className="flex h-fit w-full flex-wrap justify-start gap-1 bg-white px-2 pb-1">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="max-w-[120px] min-w-[100px] bg-gray-100 px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-blue-400 data-[state=active]:text-white"
                  >
                    {category}
                  </TabsTrigger>
                ))}
                {user?.role === "admin" && (
                  <Dialog open={addOpen} onOpenChange={setAddOpen}>
                    <DialogTrigger asChild>
                      <div className="flex w-fit items-center justify-center rounded-xl border px-4 py-2">
                        <PlusIcon className="h-4 w-4" />
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add {label}</DialogTitle>
                      </DialogHeader>
                      <DialogFooter>
                        <Input
                          type="text"
                          placeholder={`Enter ${label}`}
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                        />
                        <Button variant="outline" onClick={handleAdd}>
                          Add
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </TabsList>

              {categories.map((category) => (
                <TabsContent key={category} value={category} className="mt-6">
                  {renderItemsGrid(category, items)}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </>
      )}
    </CardContent>
  );
};

export default ItemsbyCategory;
