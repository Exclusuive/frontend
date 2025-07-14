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
import { Item } from "@/types/collection";
import { Listing } from "@/types/market";

// 타입은 필요에 따라 조정하세요.
type ItemsbyLayerProps = {
  categories: string[];
  items: any[];
  getItemsByCategory: (items: Item[], category: string) => Item[] | Listing[];
  renderItemsGrid: (category: string, items: Item[]) => React.ReactNode;
  onTabChange?: (category: string) => void;
};

const ItemsbyLayer: React.FC<ItemsbyLayerProps> = ({
  categories,
  items,
  getItemsByCategory,
  renderItemsGrid,
  onTabChange,
}) => {
  const handleTabChange = (value: string) => {
    onTabChange?.(value);
  };

  return (
    <CardContent>
      {categories.length === 0 ? (
        <div className="py-8 text-center">
          <div>First You need to make One</div>
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
            <Tabs defaultValue={categories[0]} className="w-full" onValueChange={handleTabChange}>
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

export default ItemsbyLayer;
