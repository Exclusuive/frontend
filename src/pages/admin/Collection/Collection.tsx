import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useGetMyCollections } from "@/hooks/collection";
import CollectionInfoCard from "./CollectionInfoCard";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CollectionMiniCard from "./CollectionMiniCard";
import { CreateCollectionDialog } from "./CreateCollectionDialog";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";

export default function Collection() {
  const [isOpen, setIsOpen] = useState(true);

  const account = useCurrentAccount();
  const { collections, isPending, error } = useGetMyCollections({
    owner: account ? account.address : "",
  });

  if (isPending) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">Error: {JSON.stringify(error)}</div>
    );
  }

  if (collections.length === 0)
    return (
      <div>
        {/* <CreateCollectionDialog open={true} onOpenChange={() => {}} onSuccess={() => {}} /> */}
        <CreateCollectionDialog />
      </div>
    );

  return (
    <div className="container w-full p-4">
      <Tabs defaultValue={collections[0].id} className="w-full">
        <div className="flex">
          <Card
            className={
              "col-span-1 flex h-auto cursor-pointer items-center justify-center border-2 transition-all hover:shadow-lg"
            }
            onClick={() => {
              // Create Collection
              setIsOpen(true);
            }}
          >
            <CardContent>
              <CardTitle className="text-center text-lg">Create</CardTitle>
              <CardTitle className="text-center text-lg">Collection</CardTitle>
            </CardContent>
          </Card>
          <div className="scrollbar-hide grid h-full w-full auto-cols-[minmax(100px,1fr)] grid-flow-col grid-cols-4 gap-4 overflow-x-auto">
            <TabsList className="h-full">
              {collections.map((col) => (
                <TabsTrigger className="col-span-2" key={col.id} value={col.id}>
                  <CollectionMiniCard collection={col} />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Collection Overview Card */}
        {collections.map((col, i) => (
          <TabsContent value={col.id} className="space-y-4">
            <CollectionInfoCard collection={col} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
