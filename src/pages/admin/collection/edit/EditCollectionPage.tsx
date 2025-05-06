import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SelectCollectionModal from "../SelectCollectionModal";
import { useContext, useEffect, useState } from "react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CollectionContext } from "@/context/CollectionContext";
import CollectionInfo from "./CollectionInfo";
import LayerInfo from "./LayerInfo";
import PropertyInfo from "./PropertyInfo";
import TicketInfo from "./TicketInfo";

interface Props {}

export default function EditCollectionPage({}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const {
    collection: { collections, index },
  } = useContext(CollectionContext);

  useEffect(() => {
    if (index === -1) {
      setIsOpen(true);
    }
  }, [collections, index]);

  return (
    <div className="container w-full space-y-6 p-4">
      <h1 className="text-2xl font-bold">Edit Collection Information</h1>
      <div className="flex items-center gap-4">
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button>Select Collection</Button>
          </DialogTrigger>
          <SelectCollectionModal />
        </Dialog>
        {/* Collection Name 임시 */}
        {collections && index !== -1 && (
          <h2 className="text-4xl font-semibold">
            {collections[index].objectData.content.fields.base_type.fields.type}
          </h2>
        )}
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger className="cursor-pointer" value="info">
            Collection Info
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="layers">
            Layer Types
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="properties">
            Property Types
          </TabsTrigger>
          <TabsTrigger className="cursor-pointer" value="tickets">
            Ticket Types
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <CollectionInfo />
        </TabsContent>

        <TabsContent value="layers">
          <LayerInfo />
        </TabsContent>

        <TabsContent value="properties" className="space-y-4">
          <PropertyInfo />
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <TicketInfo />
        </TabsContent>
      </Tabs>
    </div>
  );
}
