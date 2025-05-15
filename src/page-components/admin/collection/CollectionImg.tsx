import { cn } from "@/lib/utils";
import { CollectionData } from "@/types/collection";
import { useEffect, useState } from "react";

type Props = {
  collection: CollectionData;
} & React.ComponentProps<"img">;

export default function CollectionImg({ collection, className, ...props }: Props) {
  const [imgURL, setImgURL] = useState();
  useEffect(() => {
    collection.dynamicFieldData.forEach((d) => {
      if (d.content.fields.value.fields.name === "img_url") {
        setImgURL(d.content.fields.value.fields.content);
      }
    });
  }, [collection]);
  return (
    <img
      src={imgURL ? `${imgURL}?refresh=${Date.now()}` : "/DOKPAMI.png"}
      className={cn(`opacity-90 ${className}`)}
      {...props}
    />
  );
}
