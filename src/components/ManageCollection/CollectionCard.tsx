import { CollectionCardProps } from "@/types/types";

export default function CollectionCard({ item }: { item: CollectionCardProps }) {
  return (
    <div className="w-[300px] overflow-hidden rounded-2xl bg-white shadow-md">
      {/* Banner Image */}
      <div className="h-48 w-full bg-gray-400">
        <img src={item.bannerImg} alt="banner" className="h-full w-full object-cover" />
      </div>

      {/* Content */}
      <div className="p-4">
        <h2 className="text-xl font-bold">{item.name}</h2>
        <p className="mt-1 text-sm text-gray-600">{item.description}</p>
      </div>
    </div>
  );
}
