import { CollectionCardProps } from "@/types/types";
import { Button } from "./ui/button";

export default function CollectionCard({
  bannerUrl,
  title,
  description,
  showManage,
}: CollectionCardProps) {
  return (
    <div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md">
      <img src={bannerUrl} alt="banner" className="h-40 w-full bg-gray-300"></img>
      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
        <div className="mt-4 flex justify-evenly">
          <Button className="mt-3 w-fit rounded-xl border border-blue-500 bg-transparent text-sm text-blue-500">
            VIEW Status
          </Button>

          {showManage && (
            <Button className="mt-3 w-fit rounded-xl border border-black bg-transparent text-sm text-black">
              Manage
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
