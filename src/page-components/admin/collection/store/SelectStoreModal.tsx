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
import { DialogClose } from "@radix-ui/react-dialog";
import CreateStoreModal from "../../../../page-components/admin/collection/store/CreateStoreModal";

export default function SelectStoreModal() {
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
        <DialogTitle className="text-2xl">Selet Store</DialogTitle>
        <p className="text-muted-foreground text-md">Choose one of stores.</p>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pt-2 md:grid-cols-2 lg:grid-cols-3">
        {filterdStores &&
          (filterdStores.length === 0 ? (
            <p>nothing</p>
          ) : (
            filterdStores.map((store, i) => (
              <DialogClose>
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
                    <CardTitle className="text-lg">
                      {store.objectData.content.fields.name}
                    </CardTitle>
                    <p className="text-muted-foreground line-clamp-2 truncate text-sm">
                      ID: {store.objectData.content.fields.id.id}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      Slots: {store.objectData.content.fields.slots.length}
                    </p>
                  </CardContent>
                </Card>
              </DialogClose>
            ))
          ))}
      </div>

      <DialogFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create New Store</Button>
          </DialogTrigger>
          <CreateStoreModal />
        </Dialog>
      </DialogFooter>
    </DialogContent>
  );
}
