import { Card, CardContent } from "@/components/ui/card";
import { useGetAllCollection } from "@/hooks/useGetData/collection";
import CollectionImg from "@/page-components/admin/collection/CollectionImg";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ExploreCollectionModal from "./ExploreCollectionModal";

export default function ExploreCollections() {
  const { collections } = useGetAllCollection();
  console.log(collections);

  return (
    <div className="container w-full space-y-6 p-4">
      <h1 className="text-2xl font-bold">Welcome to Exclusuive</h1>

      <p className="text-lg">Explore our features and offerings below:</p>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <Card key={collection.id}>
            <CardContent>
              <div className="aspect-video w-full overflow-hidden rounded-md">
                <CollectionImg
                  collection={collection}
                  alt={collection.objectData.content.fields.base_type.fields.type}
                  className="aspect-video w-full rounded-md object-cover"
                />
              </div>
              <div className="mt-4 space-y-2 overflow-auto">
                <h1 className="text-xl font-bold">
                  {collection.objectData.content.fields.base_type.fields.type}
                </h1>
                {collection.dynamicFieldData.map((data) => {
                  if (!("name" in data.content.fields.value.fields)) return;
                  if (data.content.fields.value.fields.name === "description") {
                    return (
                      <div key={data.objectId}>
                        <p>{data.content.fields.value.fields.content}</p>
                      </div>
                    );
                  }
                })}
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="my-4 w-full">Detail View</Button>
                </DialogTrigger>
                <ExploreCollectionModal collection={collection} />
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
