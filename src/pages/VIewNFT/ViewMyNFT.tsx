import { useState } from "react";
import CollectionsLayout from "@/components/CollectionsLayout"; // Adjust the import based on your structure
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useSearchParams } from "react-router-dom";
import { useCheckUserBases } from "@/hooks/useCheckUserBases";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useGetUserItems } from "@/hooks/useGetUserItems";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { syncImg } from "@/lib/uploadToS3";

export default function ViewMyNFT() {
  const [selectedNFTId, setSelectedNFTId] = useState<string>("");
  const [searchParams] = useSearchParams();
  const collection_id = searchParams.get("collection_id") || "";
  const account = useCurrentAccount();
  const { data: nfts } = useCheckUserBases(account?.address || "", collection_id);
  const { data: items } = useGetUserItems(account?.address || "", collection_id);
  const { equipItem, popItem } = useSendTransactions();
  const [activeTab, setActiveTab] = useState<string>("");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const handleRefreshMetadata = () => {
    syncImg(selectedNFT?.id);
    setRefreshKey(Date.now());
  };

  // Find the selected NFT based on the selectedNFTId
  const selectedNFT = nfts.find((nft) => nft.id === selectedNFTId);

  const handleEquipItem = async () => {
    await equipItem({
      id: collection_id,
      baseId: selectedNFT?.id,
      itemId: selectedItem?.id,
    });
    setRefreshKey(Date.now());
  };

  const handlePopItem = async () => {
    await popItem({
      baseId: selectedNFT?.id,
      layer: activeTab,
      toAddress: account?.address || "",
    });
  };

  // Combine itemSockets and items into a single set of unique types
  const combinedTypes = new Set<string>();
  selectedNFT?.itemSockets?.forEach((socket: any) => combinedTypes.add(socket.type));
  Object.keys(items).forEach((key) => combinedTypes.add(key)); // Add each key to the set

  return (
    <div className="container mx-auto w-full py-6">
      <h1 className="mb-6 text-3xl font-bold">View My NFTs</h1>
      {/* Collections Layout */}
      <CollectionsLayout manage={false} />
      {/* Select for NFT ID */}
      <Select value={selectedNFTId} onValueChange={setSelectedNFTId}>
        <SelectTrigger>
          <SelectValue placeholder="Select NFT" />
        </SelectTrigger>
        <SelectContent>
          {nfts.map((nft) => (
            <SelectItem key={nft.id} value={nft.id}>
              {nft.id}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {/* Display Selected NFT in Full Screen */}
      {selectedNFT && (
        <div className="mt-6 grid h-full grid-cols-1 gap-6 md:grid-cols-2">
          {/* Left Column: Card for Selected NFT Image */}
          <Card className="col-span-1 h-full">
            <CardContent className="flex h-full flex-col">
              <div className="w-full flex-grow overflow-hidden rounded-md">
                <img
                  key={refreshKey}
                  src={`${selectedNFT.img_url}?refresh=${refreshKey}`}
                  alt={selectedNFT.name}
                  className="h-full w-full object-contain"
                />
              </div>

              <Button onClick={handleRefreshMetadata} className="mt-2 w-full">
                Refresh Image
              </Button>
              <CardDescription></CardDescription>
            </CardContent>
            <Carousel>
              <CarouselContent>
                {selectedNFT?.itemSockets?.length > 0 &&
                  selectedNFT.itemSockets.map((item: any, index: number) => (
                    <CarouselItem key={index} className="px-3 md:basis-1/2 lg:basis-1/3">
                      <p className="text-center font-bold">{item.type}</p>
                      {item.items.length > 0 ? (
                        <img
                          src={item.items[0].img_url}
                          alt={item.items[0].item_type}
                          className="mx-auto my-2 h-24 w-24 rounded-md border border-black object-cover"
                        />
                      ) : (
                        <p>No image available</p>
                      )}
                      <div className="mt-2 text-center">
                        <h4 className="font-medium">{item.items[0]?.name || "Unknown Item"}</h4>
                        {item.items[0]?.properties?.map((property: any) => (
                          <p key={property.type}>
                            {property.type}: {property.value}
                          </p>
                        ))}
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
            </Carousel>
          </Card>

          {/* Right Column: Tabs for Layer Information and Items */}
          <Card className="col-span-1 h-full">
            <CardHeader>
              <CardTitle>Items you have</CardTitle>
            </CardHeader>

            <CardContent className="flex-grow">
              <Tabs
                defaultValue={Array.from(combinedTypes)[0] || ""}
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="w-full">
                  {Array.from(combinedTypes).map((type) => (
                    <TabsTrigger key={type} value={type}>
                      {type}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <h3 className="font-medium">Items in Address:</h3>

                {Object.keys(items).map((layer) => (
                  <TabsContent key={layer} value={layer}>
                    <div className="mt-4">
                      {items[layer].map((item, index) => (
                        <div
                          key={index}
                          className={`flex cursor-pointer items-center gap-4 rounded-lg border p-2 hover:bg-gray-100 ${selectedItem?.id === item.id ? "border-2 border-blue-500" : "border-gray-200"}`}
                          onClick={() => setSelectedItem(item)}
                        >
                          <div className="h-16 w-16 overflow-hidden rounded-md">
                            <img
                              src={item.img_url}
                              alt={item.type}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <h3 className="font-bold">
                            {item.type}
                            {item?.properties?.map((property: any) => (
                              <p className="font-medium" key={property.type}>
                                {property.type}: {property.value}
                              </p>
                            ))}
                          </h3>
                        </div>
                      )) || <p>No items found for this layer.</p>}
                    </div>
                    {selectedItem && (
                      <Button onClick={handleEquipItem} className="mt-4 w-full">
                        Equip
                      </Button>
                    )}
                  </TabsContent>
                ))}

                <h3 className="font-medium">Items in Base Object:</h3>

                {nfts[0]?.itemsBags &&
                  nfts[0]?.itemsBags.map((bag: any) => (
                    <TabsContent key={bag.type} value={bag.type}>
                      <div className="mt-4">
                        {(activeTab === bag.type &&
                          bag.items.map((item: any, index: number) => (
                            <div
                              key={index}
                              className={`flex cursor-pointer items-center gap-4 rounded-lg border p-2 hover:bg-gray-100 ${selectedItem?.id === item.id ? "border-2 border-blue-500" : "border-gray-200"}`}
                              onClick={() => setSelectedItem(item)}
                            >
                              <div className="h-16 w-16 overflow-hidden rounded-md">
                                <img
                                  src={item.img_url}
                                  alt={item.item_type}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <h3 className="font-medium">{item.item_type}</h3>
                            </div>
                          ))) || <p>No items found for this layer.</p>}
                      </div>

                      <Button onClick={handlePopItem} className="mt-4 w-full">
                        Pop Item to Address
                      </Button>
                    </TabsContent>
                  ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
