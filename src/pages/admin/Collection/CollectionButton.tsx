import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CollectionData } from "@/types/collection";
import { useEffect, useState } from "react";
interface Props {
  collection: CollectionData;
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined;
}

export default function CollectionButton({ collection, onClick }: Props) {
  const [imgURL, setImgURL] = useState("");

  useEffect(() => {
    collection.dynamicFieldData.forEach((d) => {
      if (d.content.fields.value.fields.name === "img_url") {
        setImgURL(d.content.fields.value.fields.content);
      }
    });
  }, [collection]);
  return (
    <Card
      key={collection.id}
      className={"cursor-pointer border-2 transition-all hover:shadow-lg"}
      onClick={onClick}
    >
      <CardHeader>
        <img
          src={imgURL}
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
