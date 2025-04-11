import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";
import { Collection } from "@/types/types";

type Props = {
  items: Collection[];
  onClick: (colId: string) => void;
};

export default function SelectCollectionCard({ items, onClick }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Pick your Collection</h2>
        <p className="text-muted-foreground text-sm">Choose one to view or customize your NFTs.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          return (
            <Card
              key={item.id}
              className={clsx("cursor-pointer border-2 transition-all hover:shadow-lg")}
              onClick={() => onClick(item.id)}
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
                <p className="text-muted-foregrodund line-clamp-2 text-sm">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
