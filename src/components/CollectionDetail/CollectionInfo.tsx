import { CollectionInfoProps } from "@/types/types";
import { Button } from "../ui/button";

const CollectionInfo = ({ data, setSelectedOption }: CollectionInfoProps) => {
  const sortedLayers = [...data.layers].sort((a, b) => a.order! - b.order!);

  return (
    <div className="my-auto w-full space-y-4 p-6">
      <img
        src={data.bannerImg}
        alt="Collection"
        className="aspect-video w-full rounded-xl object-cover"
      />
      <div>
        <h2 className="text-2xl font-semibold">{data.name}</h2>
        <p className="mt-2 text-sm text-gray-500">{data.description}</p>

        <div className="mt-4 w-full text-sm">
          <h2 className="text-lg font-bold">Layers</h2>
          {sortedLayers.map((layer, idx) => (
            <span key={idx}>
              {layer.type}
              {idx < sortedLayers.length - 1 && " > "}
            </span>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 justify-between gap-3">
          <Button
            className="min-w-[100px] flex-1 rounded-xl border border-blue-500 bg-transparent text-sm text-blue-500"
            onClick={() => setSelectedOption("collection")}
          >
            EDIT Collection
          </Button>
          <Button
            className="min-w-[100px] flex-1 rounded-xl border border-blue-500 bg-transparent text-sm text-blue-500"
            onClick={() => setSelectedOption("layer")}
          >
            EDIT Layers
          </Button>
          <Button
            className="min-w-[100px] flex-1 rounded-xl border border-blue-500 bg-transparent text-sm text-blue-500"
            onClick={() => setSelectedOption("item")}
          >
            Add Item
          </Button>
          <Button
            className="min-w-[100px] flex-1 rounded-xl border border-blue-500 bg-transparent text-sm text-blue-500"
            onClick={() => setSelectedOption("mint")}
          >
            Mint Base
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CollectionInfo;
