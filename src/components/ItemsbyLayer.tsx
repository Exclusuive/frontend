import { CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { getItemsByLayer } from "@/lib/items";
import { Item } from "@/types/collection";

// 타입은 필요에 따라 조정하세요.
type ItemsbyLayerProps = {
  layers: string[];
  items: any[];
  renderItemsGrid: (layer: string, items: Item[]) => React.ReactNode;
};

const ItemsbyLayer: React.FC<ItemsbyLayerProps> = ({ layers, items, renderItemsGrid }) => {
  return (
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
                      <Badge variant="secondary">{getItemsByLayer(items, layer).length}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {renderItemsGrid(layer, items)}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="hidden xl:block">
            <Tabs defaultValue={layers[0]} className="w-full">
              <TabsList className="flex h-fit w-full flex-wrap justify-start gap-1 bg-white px-2 pb-1">
                {layers.map((layer) => (
                  <TabsTrigger
                    key={layer}
                    value={layer}
                    className="max-w-[120px] min-w-[100px] bg-gray-100 px-4 py-2 text-sm whitespace-nowrap data-[state=active]:bg-blue-400 data-[state=active]:text-white"
                  >
                    {layer}
                  </TabsTrigger>
                ))}
              </TabsList>

              {layers.map((layer) => (
                <TabsContent key={layer} value={layer} className="mt-6">
                  {renderItemsGrid(layer, items)}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </>
      )}
    </CardContent>
  );
};

export default ItemsbyLayer;
