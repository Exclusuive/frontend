import { CollectionItem } from "@/types/collection";

export const extractItemImages = (items: CollectionItem[]) => {
  const images = items.map((item) => item.img_url);
  return images;
};
