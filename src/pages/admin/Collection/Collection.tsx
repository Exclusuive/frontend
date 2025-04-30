import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useGetMyCollections } from "@/hooks/collection";
import { CollectionData } from "@/types/collection";
import CollectionInfoCard from "./CollectionInfoCard";

export default function Collection() {
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();
  // const [activeTab, setActiveTab] = useState(currentCollection?.objectData.content.fields.layer_types.fields.contents[0] || "");

  const { collections, isPending } = useGetMyCollections({
    owner: "0x23c11df86fad8d628fe9b7fb6bf0b27be231f995b476ae1cff2a227575e96fad",
  });

  useEffect(() => {
    if (collections) {
      setCurrentCollection(collections[0]);
    }
  }, [collections, isPending]);

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
              <Card
                key={i}
                className={"cursor-pointer border-2 transition-all hover:shadow-lg"}
                onClick={() => {
                  setCurrentCollection(collections[i]);
                }}
              >
                <CardHeader>
                  <img
                    src={"/DOKPAMI.png"}
                    alt={col.id}
                    className="aspect-video w-full rounded-md object-cover"
                  />
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-lg">
                    {col.id.slice(0, 5)}...{col.id.slice(-5)}
                  </CardTitle>
                  <p className="text-muted-foreground line-clamp-2 text-sm">
                    {col.id.slice(0, 5)}...{col.id.slice(-5)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {currentCollection && <CollectionInfoCard collection={currentCollection} />}
    </div>
  );
}
