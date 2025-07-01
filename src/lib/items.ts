export const getItemsByLayer = (items: any[], layer: string) => {
  return items.filter((item) => item.layer === layer);
};
