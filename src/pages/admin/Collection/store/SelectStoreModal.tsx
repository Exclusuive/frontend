import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  Dialog,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useContext, useEffect, useState } from "react";
import { CollectionContext } from "@/context/CollectionContext";
import { StoreData } from "@/types/store";

export default function SelectStoreModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [filterdStores, setFilteredStores] = useState<StoreData[]>();
  const {
    collection: { collections, index: cIndex },
    store: { stores, index, setIndex },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (stores && collections && collections.length > 0 && cIndex !== -1) {
      setFilteredStores(
        stores.filter(
          (store) => store.objectData.content.fields.collection_id === collections[cIndex].id
        )
      );
    }
  }, [stores, cIndex]);
  return (
    <DialogContent className="max-h-[75vh] w-2/3 min-w-2/3 overflow-y-auto [&>button]:hidden">
      <DialogHeader>
        <DialogTitle className="text-2xl">Pick Your Collection Store</DialogTitle>
        {/* <p className="text-muted-foreground text-sm">Choose one to view or customize your NFTs.</p> */}
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pt-2 md:grid-cols-2 lg:grid-cols-3">
        {filterdStores &&
          (filterdStores.length === 0 ? (
            <p>nothing</p>
          ) : (
            filterdStores.map((store, i) => (
              <Card
                key={store.id}
                onClick={() => {
                  setIndex(i);
                }}
                className={clsx(
                  `${index === i ? "border-blue-400" : ""} cursor-pointer border-2 transition-all hover:border-4 hover:shadow-lg`
                )}
              >
                <CardHeader>
                  {/* <CollectionImg
                  collection={col}
                  alt={col.objectData.content.fields.base_type.fields.type}
                  className="aspect-video w-full rounded-md object-cover"
                /> */}
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg">{store.objectData.content.fields.name}</CardTitle>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {store.objectData.content.fields.id.id}
                  </p>
                </CardContent>
              </Card>
            ))
          ))}
      </div>

      <DialogFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button>Create New Store</Button>
          </DialogTrigger>
          {/* <CreateCollectionModal isOpen={isOpen} /> */}
        </Dialog>
      </DialogFooter>
    </DialogContent>
  );
}
