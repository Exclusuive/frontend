import { CollectionCardProps } from "@/types/types";
import { Button } from "./ui/button";

export default function CollectionCard({ title, description, showManage }: CollectionCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="h-40 bg-gray-300"></div>
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
