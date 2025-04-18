import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Supplier } from "@/types/types";
import clsx from "clsx";
import { Button } from "./ui/button";

type Props = {
  open: boolean;
  onCreate: () => void;
  items: Supplier[];
  create: boolean;
  onClick: (supplier: Supplier) => void;
  onOpenChange: (open: boolean) => void;
};

export default function SelectSupplierModal({
  open,
  items,
  onClick,
  create,
  onCreate,
  onOpenChange,
}: Props) {
  console.log(items);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[75vh] w-2/3 min-w-2/3 overflow-y-auto [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="text-2xl">Pick your Supplier</DialogTitle>
          <p className="text-muted-foreground text-sm">
            Choose one to view or manage supplier contracts.
          </p>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 overflow-y-auto pt-2 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Card
              key={`${item.supplier_id}_${item.name?.fields?.selection_number}`}
              onClick={() => onClick(item)}
              className={clsx("cursor-pointer border-2 transition-all hover:shadow-lg")}
            >
              <CardHeader>
                <CardTitle className="text-lg">TEST</CardTitle>
                <p className="text-muted-foreground text-sm">
                  ID: {item.supplier_id.slice(0, 8)}...
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  Selections: {item.selections?.length || 0}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        {create && (
          <DialogFooter>
            <Button onClick={onCreate}>Create New Supplier</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
