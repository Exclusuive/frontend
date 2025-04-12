import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collection } from "@/types/types";
import clsx from "clsx";
import { Button } from "./ui/button";

type Props = {
  open: boolean;
  onCreate: () => void;
  items: Collection[];
  create: boolean;
  onClick: (collection_id: string) => void;
  onOpenChange: (open: boolean) => void;
};

export default function SelectCollectionModal({
  open,
  items,
  onClick,
  create,
  onCreate,
  onOpenChange,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[75vh] w-2/3 min-w-2/3 overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">Pick your Collection</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Choose one to view or customize your NFTs.
          </p>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 overflow-y-auto pt-2 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card
              key={item.collection_id}
              onClick={() => onClick(item.collection_id)}
              className={clsx("cursor-pointer border-2 transition-all hover:shadow-lg")}
            >
              <CardHeader>
                <img
                  src={item.img_url}
                  alt={item.name}
                  className="aspect-video w-full rounded-md object-cover"
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                <p className="text-muted-foreground line-clamp-2 text-sm">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        {create && (
          <DialogFooter>
            <Button onClick={onCreate}>Create New Collection</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
