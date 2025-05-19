import { useState } from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { CollectionData } from "@/types/collection";
import { CollectionImg } from "@/page-components/admin/collection";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
interface Props {
  collection: CollectionData;
}

export default function ExploreCollectionModal({ collection }: Props) {
  const [selectedLayer, setSelectedLayer] = useState<string>("");

  console.log(collection);

  return (
    <DialogContent className="max-h-[90vh] overflow-y-auto p-6 sm:max-w-[600px]">
      <DialogHeader className="pb-4">
        <DialogTitle>Detail View</DialogTitle>
        <DialogDescription>Detail view of the collection.</DialogDescription>
      </DialogHeader>

      <form className="max-h-[500px] space-y-6 overflow-auto pr-4 pl-2">
        {/* Collection Name */}
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

        <div className="space-y-4">
          <div className="overflow-auto">
            <h3 className="font-medium">Property Types</h3>
            {collection.objectData.content.fields.property_types.fields.contents.length > 0 ? (
              collection.objectData.content.fields.property_types.fields.contents.map((data) => (
                <span key={data.type}>
                  <p className="text-muted-foreground text-sm">{data.fields.type}</p>{" "}
                </span>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No property types defined</p>
            )}
          </div>
          <div>
            <h3 className="font-medium">Layer Types</h3>
            {collection.objectData.content.fields.layer_types.fields.contents.length > 0 ? (
              collection.objectData.content.fields.layer_types.fields.contents.map((data) => (
                <span key={data.type}>
                  <p className="text-muted-foreground text-sm">{data.fields.type}</p>{" "}
                </span>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No layer types defined</p>
            )}
          </div>
          <div>
            <h3 className="font-medium">Ticket Types</h3>
            {collection.objectData.content.fields.ticket_types.fields.contents.length > 0 ? (
              collection.objectData.content.fields.ticket_types.fields.contents.map((data) => (
                <span key={data.type}>
                  <p className="text-muted-foreground text-sm">{data.fields.type}</p>{" "}
                </span>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No ticket types defined</p>
            )}
          </div>
        </div>
        <Tabs defaultValue={"layers"} className="w-full" onValueChange={setSelectedLayer}>
          <TabsList className="w-full">
            {collection.objectData.content.fields.layer_types.fields.contents.length > 0 ? (
              collection.objectData.content.fields.layer_types.fields.contents.map((l) => (
                <TabsTrigger key={l.fields.type} value={l.fields.type}>
                  {l.fields.type}
                </TabsTrigger>
              ))
            ) : (
              <TabsTrigger value="no-layers">No Layers</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value={selectedLayer}>
            <div className="space-y-4 overflow-auto">
              {(() => {
                const mergedData = new Map();

                // First pass: collect all configs
                collection.dynamicFieldData
                  .filter((d) => d.type.includes("ItemType") && d.type.includes("Config"))
                  .forEach((d) => {
                    const config = {
                      item_type: d.content.fields.name.fields.type,
                      img_url: d.content.fields.value.fields.content,
                    };
                    mergedData.set(config.item_type, { ...config });
                  });

                // Second pass: merge items with their configs
                collection.dynamicFieldData
                  .filter((d) => d.type.includes("ItemType") && !d.type.includes("Config"))
                  .forEach((d) => {
                    const item = {
                      item_type: d.content.fields.value.fields.item_type,
                      layer_type: d.content.fields.value.fields.type.fields.type,
                    };

                    const existingData = mergedData.get(item.item_type) || {};
                    mergedData.set(item.item_type, {
                      ...existingData,
                      ...item,
                    });
                  });

                return Array.from(mergedData.values())
                  .filter((item) => item.layer_type === selectedLayer)
                  .map((item, i) => (
                    <div key={i}>
                      <div
                        className={`flex cursor-pointer items-center gap-4 rounded-lg border border-gray-200 p-2 hover:bg-gray-100`}
                      >
                        <div className="h-16 w-16 overflow-hidden rounded-md">
                          <img src={item.img_url} alt="" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.item_type}</h3>
                        </div>
                      </div>
                    </div>
                  ));
              })()}
            </div>
          </TabsContent>
          <TabsContent value="combinations">
            <div className="space-y-4">
              <p>Combination information will be displayed here.</p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <DialogClose>
            <Link to={`/member/store/${collection.id}`}>Go to Store</Link>
          </DialogClose>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
