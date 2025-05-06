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
import { useContext, useState } from "react";
import { CollectionContext } from "@/context/CollectionContext";
import { CreateCollectionModal } from "./";
import CollectionImg from "@/page-components/admin/collection/CollectionImg";
import { DialogClose } from "@radix-ui/react-dialog";

export default function SelectCollectionModal() {
  const {
    collection: { collections, index, setIndex },
    store: { setIndex: setSIndex },
  } = useContext(CollectionContext);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DialogContent className="max-h-[75vh] w-2/3 min-w-2/3 overflow-y-auto [&>button]:hidden">
      <DialogHeader>
        <DialogTitle className="text-2xl">Pick your Collection</DialogTitle>
        <p className="text-muted-foreground text-md">Choose one to view or customize your NFTs.</p>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pt-2 md:grid-cols-2 lg:grid-cols-3">
        {collections &&
          collections.map((col, i) => (
            <DialogClose>
              <Card
                key={col.id}
                onClick={() => {
                  setIndex(i);
                  if (i !== index) {
                    setSIndex(-1);
                  }
                }}
                className={clsx(
                  `${index === i ? "border-blue-400" : ""} cursor-pointer border-2 transition-all hover:border-4 hover:shadow-lg`
                )}
              >
                <CardHeader>
                  <CollectionImg
                    collection={col}
                    alt={col.objectData.content.fields.base_type.fields.type}
                    className="aspect-video w-full rounded-md object-cover"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg">
                    {col.objectData.content.fields.base_type.fields.type}
                  </CardTitle>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {col.objectData.content.fields.base_type.fields.type}
                  </p>
                </CardContent>
              </Card>
            </DialogClose>
          ))}
      </div>

      <DialogFooter>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button>Create New Collection</Button>
          </DialogTrigger>
          <CreateCollectionModal isOpen={isOpen} />
        </Dialog>
      </DialogFooter>
    </DialogContent>
  );
}
