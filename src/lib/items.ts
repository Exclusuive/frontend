import { Attribute, Item } from "@/types/collection";

export const getItemsByLayer = (items: Item[], layer: string) => {
  return items.filter((item) => item.layer === layer);
};

export const formatItemAttributes = (raw: string | Attribute[]) => {
  if (Array.isArray(raw)) {
    return raw;
  }

  const attributes = raw.split(",");
  return attributes.map((attribute) => {
    const [name, value] = attribute.split(":");
    return { name: name.trim(), value: parseInt(value.trim()) };
  });
};
