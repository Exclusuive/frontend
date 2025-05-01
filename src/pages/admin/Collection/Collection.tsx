import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useGetMyCollections } from "@/hooks/collection";
import { CollectionData } from "@/types/collection";
import CollectionInfoCard from "./CollectionInfoCard";
import CollectionButton from "./CollectionButton";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function Collection() {
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();

  const account = useCurrentAccount();
  const { collections, isPending, error } = useGetMyCollections({
    owner: account ? account.address : "",
  });

  useEffect(() => {
    if (collections) {
      setCurrentCollection(collections[0]);
    }
  }, [collections, isPending]);

  if (isPending) {
    return <div className="flex items-center justify-center p-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">Error: {JSON.stringify(error)}</div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <section className="flex gap-4">
        <Card
          className={
            "flex h-auto w-[150px] cursor-pointer items-center justify-center border-2 transition-all hover:shadow-lg"
          }
        >
          <CardContent>
            <CardTitle className="text-center text-lg">Create</CardTitle>
            <CardTitle className="text-center text-lg">Collection</CardTitle>
          </CardContent>
        </Card>

        {/* Collection List */}
        <div className="scrollbar-hide overflow-x-auto">
          <div className="grid auto-cols-[minmax(150px,1fr)] grid-flow-col gap-4">
            {collections.map((col, i) => (
              <CollectionButton
                collection={col}
                onClick={() => {
                  setCurrentCollection(collections[i]);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {currentCollection && <CollectionInfoCard collection={currentCollection} />}
    </div>
  );
}
