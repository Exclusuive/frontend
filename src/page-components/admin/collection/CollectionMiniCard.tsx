import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CollectionData } from "@/types/collection";
import CollectionImg from "@/page-components/admin/collection/CollectionImg";
interface Props {
  collection: CollectionData;
}

export default function CollectionMiniCard({ collection }: Props) {
  return (
    <Card key={collection.id} className={"cursor-pointer border-2 transition-all hover:shadow-lg"}>
      <CardHeader>
        <CollectionImg
          collection={collection}
          alt={collection.objectData.content.fields.base_type.fields.type}
          className="aspect-video w-full rounded-md object-cover"
        />
      </CardHeader>
      <CardContent>
        <CardTitle className="text-lg">
          {collection.objectData.content.fields.base_type.fields.type}
        </CardTitle>
        <p className="text-muted-foreground line-clamp-2 text-sm">
          {collection.id.slice(0, 5)}...{collection.id.slice(-5)}
        </p>
      </CardContent>
    </Card>
  );
}
