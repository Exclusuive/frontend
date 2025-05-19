import { DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";
import { useGetUserCollections } from "@/hooks/useGetData/collection";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { CollectionData } from "@/types/collection";
import CollectionImg from "@/page-components/admin/collection/CollectionImg";

export default function SelectBaseModal({
  selectedCollection,
  setSelectedCollection,
  setSelectedBase,
}: {
  selectedCollection: CollectionData | null;
  setSelectedCollection: (collection: CollectionData) => void;
  setSelectedBase: (base: any) => void;
}) {
  const account = useCurrentAccount();
  const { collections } = useGetUserCollections({
    userAddress: account?.address || "",
  });

  return (
    <DialogContent className="max-h-[75vh] w-2/3 min-w-2/3 overflow-y-auto [&>button]:hidden">
      <DialogHeader>
        <DialogTitle className="text-2xl">
          Select {selectedCollection ? "Base" : "Collection"}
        </DialogTitle>
        <p className="text-muted-foreground text-md">Choose one to view or customize your NFTs.</p>
      </DialogHeader>

      <div className="grid grid-cols-1 gap-4 overflow-y-auto pt-2 md:grid-cols-2 lg:grid-cols-3">
        {collections &&
          !selectedCollection &&
          collections.map((col, _i) => (
            <Card
              key={col.id}
              onClick={() => setSelectedCollection(col)}
              className={clsx(
                `cursor-pointer border-2 transition-all hover:border-4 hover:shadow-lg`
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
          ))}
        {selectedCollection &&
          selectedCollection.bases?.map((base, _i) => (
            <DialogClose asChild key={base.data.fields.id.id}>
              <Card
                onClick={() => setSelectedBase(base)}
                className={clsx(
                  `cursor-pointer border-2 transition-all hover:border-4 hover:shadow-lg`
                )}
              >
                <CardHeader>
                  <img
                    src={base.data.fields.img_url}
                    alt={base.data.fields.name}
                    className="aspect-video w-full rounded-md object-cover"
                  />
                  <p className="text-muted-foreground truncate text-sm">{base.data.fields.id.id}</p>
                </CardHeader>
              </Card>
            </DialogClose>
          ))}
      </div>
    </DialogContent>
  );
}
