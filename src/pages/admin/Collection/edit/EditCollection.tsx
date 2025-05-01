import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectCollectionModal from "../SelectCollectionModal";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CollectionContext } from "@/context/CollectionContext";
import { CollectionData } from "@/types/collection";
import CollectionInfo from "./CollectionInfo";
import LayerInfo from "./LayerInfo";
import PropertyInfo from "./PropertyInfo";
import TicketInfo from "./TicketInfo";

interface Props {}

export default function EditCollection({}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCollection, setCurrentCollection] = useState<CollectionData>();

  const { collections, index } = useContext(CollectionContext);

  useEffect(() => {
    console.log("finally", collections);
    console.log("finally index", index);
    if (collections) {
      setCurrentCollection(collections[index]);
    }
  }, [collections, index]);

  return (
    <div className="container w-full space-y-6 p-4">
      <h1 className="text-2xl font-bold">Edit Collection Information</h1>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          <Button>Select Collection</Button>
        </DialogTrigger>
        <SelectCollectionModal />
      </Dialog>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="info">Collection Info</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="tickets">Tickets</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          {currentCollection && (
            <CollectionInfo key={currentCollection.id} collection={currentCollection} />
          )}
        </TabsContent>

        <TabsContent value="layers">
          {currentCollection && (
            <LayerInfo key={currentCollection.id} collection={currentCollection} />
          )}
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          {currentCollection && (
            <PropertyInfo key={currentCollection.id} collection={currentCollection} />
          )}
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          {currentCollection && (
            <TicketInfo key={currentCollection.id} collection={currentCollection} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
