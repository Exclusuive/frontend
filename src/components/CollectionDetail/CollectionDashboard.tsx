import { useState } from "react";
import { Button } from "../ui/button";

export default function CollectionDashboard({ data }: any) {
  const [menu, setMenu] = useState(data.layers[0].type);

  return (
    <div className="grid h-full grid-cols-1 gap-x-8 text-start xl:grid-cols-2">
      <div>
        <img
          src={data.bannerImg}
          alt="Collection"
          className="aspect-video w-full rounded-xl border border-black object-cover"
        />
        <div>
          <h2 className="py-4 text-2xl font-semibold">{data.name}</h2>
          <p className="text-md mt-2 text-gray-500">{data.description}</p>

          <h2 className="py-4 text-xl font-bold">Layers</h2>
          {data.layers.map((layer: any, idx: number) => (
            <span className="text-md mt-2" key={idx}>
              {layer.type}
              {idx < data.layers.length - 1 && " > "}
            </span>
          ))}
        </div>
      </div>
      <div className="h-full w-full">
        <div className="flex w-full flex-wrap justify-center gap-x-5">
          {data.layers.map((item: any) => (
            <Button
              key={item.type}
              onClick={() => setMenu(item.type)}
              className={`flex w-fit cursor-pointer items-center rounded-lg border border-black bg-gray-100 text-black hover:text-white ${
                menu === item.type && "bg-black text-white"
              }`}
            >
              <p className="w-full">{item.type}</p>
            </Button>
          ))}
        </div>
        <div className="grid h-1/2 w-full grid-cols-3 gap-4 py-5">
          {data.items[menu]?.map((item: any, idx: number) => (
            <div key={idx} className="text-center">
              <img
                src={item.img_url}
                alt={item.type}
                className="aspect-square w-full rounded rounded-2xl border border-black object-cover"
              />
              <p className="mt-1 text-sm">{item.type}</p>
            </div>
          ))}
        </div>
        <div className="my-auto text-center text-xl">📝 Dashboard will be available Soon!</div>
      </div>
    </div>
  );
}
