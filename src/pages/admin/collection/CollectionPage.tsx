import { Card, CardContent, CardTitle } from "@/components/ui/card";
import CollectionOverview from "./CollectionOverview";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CollectionMiniCard from "./CollectionMiniCard";
import { CreateCollectionModal } from "./CreateCollectionModal";
import { useContext, useEffect, useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { CollectionContext } from "@/context/CollectionContext";

export default function CollectionPage() {
  const [isOpen, setIsOpen] = useState(false);

  const account = useCurrentAccount();
  const {
    collection: { collections, isPending, error },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (account && !isPending && collections && collections.length === 0) {
      setIsOpen(true);
    }
  }, [collections]);

  if (!account) {
    return <div className="flex items-center justify-center p-8">Please Connect Wallet</div>;
  }

  if (isPending) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">Error: {JSON.stringify(error)}</div>
    );
  }

  return (
    <div className="container w-full p-4">
      {collections && (
        <Tabs defaultValue={collections.length > 0 ? collections[0].id : ""} className="w-full">
          <div className="flex">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger>
                <Card
                  className={
                    "col-span-1 flex h-full cursor-pointer items-center justify-center border-2 transition-all hover:shadow-lg"
                  }
                >
                  <CardContent>
                    <CardTitle className="text-center text-lg">Create</CardTitle>
                    <CardTitle className="text-center text-lg">Collection</CardTitle>
                  </CardContent>
                </Card>
              </DialogTrigger>
              <CreateCollectionModal isOpen={isOpen} />
            </Dialog>
            <div className="scrollbar-hide grid h-full w-full auto-cols-[minmax(100px,1fr)] grid-flow-col grid-cols-4 gap-4 overflow-x-auto rounded-md bg-gray-100">
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
          {collections.map((col) => (
            <TabsContent value={col.id} key={col.id} className="space-y-4">
              <CollectionOverview collection={col} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
