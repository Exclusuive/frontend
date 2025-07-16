import { useGetCollectionDetail } from "@/hooks/useGetCollectionDetail";
import { DialogContent, DialogHeader, DialogDescription, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CollectionItem } from "@/types/collection";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";

export default function CollectionDetail({ collectionId }: { collectionId: string }) {
  const { collectionDetail, isPending, error } = useGetCollectionDetail(collectionId);

  console.log(collectionDetail);

  if (isPending)
    return (
      <DialogContent className="flex items-center justify-center p-8">Loading...</DialogContent>
    );
  if (error)
    return (
      <DialogContent className="flex items-center justify-center p-8 text-red-600">
        Error: {error}
      </DialogContent>
    );

  // Group items by layer
  const itemsByLayer =
    collectionDetail?.items?.reduce(
      (acc, item) => {
        if (!acc[item.layer]) {
          acc[item.layer] = [];
        }
        acc[item.layer].push(item);
        return acc;
      },
      {} as Record<string, CollectionItem[]>,
    ) || {};

  return (
    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-xl">Collection Details</DialogTitle>
        <DialogDescription>Basic information about the collection</DialogDescription>
      </DialogHeader>
      <div>
        {/* Collection Header */}
        <div className="flex flex-col gap-y-2">
          {/* Collection Image */}
          <img
            src={collectionDetail?.img_url}
            alt={collectionDetail?.name}
            className="w-full rounded-lg border object-cover p-4"
          />

          {/* Collection Info */}
          <div className="my-4 w-full">
            <div className="text-2xl font-bold">{collectionDetail?.name}</div>
            <div>Collection ID: {collectionDetail?.collection_id}</div>
            <div className="text-gray-700">{collectionDetail?.description}</div>
          </div>
        </div>

        {Object.keys(itemsByLayer).length > 0 && (
          <div className="space-y-4">
            <div className="text-xl font-bold">Items</div>
            <Accordion type="single" collapsible>
              {Object.keys(itemsByLayer).map((category) => (
                <AccordionItem key={category} value={category}>
                  <AccordionTrigger className="cursor-pointer px-4 py-3 text-left">
                    <div className="flex w-full items-center justify-between">
                      <span className="font-medium">{category}</span>
                      <Badge variant="secondary">{itemsByLayer[category].length}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4">
                    {itemsByLayer[category].map((item) => (
                      <div className="flex w-full gap-2" key={item.id}>
                        <img
                          className="h-16 w-16 rounded-lg object-cover"
                          src={item.img_url}
                          alt={item.name}
                        />
                        <div className="flex flex-col gap-y-2">
                          <div className="text-lg font-bold">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                          <div className="flex flex-wrap gap-2">
                            {item.attributes?.map((attribute) => (
                              <Badge key={attribute.name} variant="secondary">
                                {attribute.name}: {attribute.value}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}

        {collectionDetail?.missions && collectionDetail?.missions.length > 0 && (
          <div className="space-y-4">
            <div className="text-xl font-bold">Current Missions</div>
            <div className="space-y-4">
              {collectionDetail?.missions?.map((mission) => (
                <Card key={mission.id} className="border-l-4 border-l-blue-500">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{mission.name}</CardTitle>
                        <CardDescription className="mt-2">{mission.description}</CardDescription>
                      </div>
                      <div className="flex flex-row items-end gap-2">
                        <Badge variant="secondary">{mission.status}</Badge>
                        <Badge variant="outline" className="text-xs">
                          {mission.type}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-600">Reward:</span>
                      <span className="text-sm font-semibold text-green-600">{mission.reward}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}
