import { Button } from "@/components/ui/button";

import { DialogTrigger } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";

import SelectBaseModal from "./SelectBaseModal";
import { useState } from "react";
import { CollectionData } from "@/types/collection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ItemCard from "./ItemCard";
import { syncImg } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
export default function MyNFTs() {
  const [selectedCollection, setSelectedCollection] = useState<CollectionData | null>(null);
  const [selectedBase, setSelectedBase] = useState<any>();
  const [time, setTime] = useState(Date.now());

  return (
    <div className="container mx-auto w-full space-y-6 p-4">
      <Dialog>
        <DialogTrigger asChild className="flex flex-col items-center justify-center">
          <Button>Select Base NFTs</Button>
        </DialogTrigger>
        <SelectBaseModal
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
          setSelectedBase={setSelectedBase}
        />
      </Dialog>

      {selectedBase && (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* Top Left */}
            <Card title="Collection Information Card">
              <CardHeader>
                <CardTitle>My NFT Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video w-full overflow-hidden rounded-md">
                  <img
                    src={`${selectedBase.data.fields.img_url}?refresh=${time}`}
                    alt={selectedBase.data.fields.name}
                    className="aspect-video w-full rounded-md object-cover"
                  />
                </div>
                <Button
                  onClick={() => {
                    setTime(Date.now());
                    syncImg(selectedBase.id);
                  }}
                >
                  Sync Image
                </Button>
              </CardContent>
            </Card>

            {/* Bottom Left */}
            <Card title="Equipped Items">
              <CardHeader>
                <CardTitle>Equipped Items</CardTitle>
                <Carousel>
                  <CarouselContent>
                    {selectedBase?.dynamicFieldData?.length > 0 &&
                      selectedBase.dynamicFieldData
                        .filter((item: any) => item.type.includes("ItemSocket"))
                        .map((item: any, index: number) => (
                          <CarouselItem key={index} className="px-3 md:basis-1/2 lg:basis-1/3">
                            {item.content.fields.value.fields.socket.fields ? (
                              <div>
                                <img
                                  src={item.content.fields.value.fields.socket.fields.img_url}
                                  alt={item.content.fields.value.fields.socket.fields.item_type}
                                  className="mx-auto my-2 h-24 w-24 rounded-md border border-black object-cover"
                                />
                                <h4 className="text-center font-medium">
                                  {item.content.fields.value.fields.socket.fields.item_type}
                                </h4>
                              </div>
                            ) : (
                              <p>No image available</p>
                            )}
                            {/* <div className="mt-2 text-center">
                              <h4 className="font-medium">
                                {item.fields.value.fields.socket.fields.items[0]?.name ||
                                  "Unknown Item"}
                              </h4>
                              {item.fields.value.fields.socket.fields.items[0]?.properties?.map(
                                (property: any) => (
                                  <p key={property.type}>
                                    {property.type}: {property.value}
                                  </p>
                                )
                              )}
                            </div> */}
                          </CarouselItem>
                        ))}
                  </CarouselContent>
                </Carousel>
              </CardHeader>
            </Card>
          </div>

          {/* Right Column - Layer Items and Chart */}
          <div className="flex flex-col gap-4">
            <ItemCard selectedBase={selectedBase} selectedCollection={selectedCollection} />
          </div>
        </section>
      )}
    </div>
  );
}
