import { useState } from "react";
import { Button } from "../ui/button";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { useParams } from "react-router-dom";

export default function CollectionDashboard({ data }: any) {
  const [menu, setMenu] = useState(data.layers[0].type);
  const [selectedItem, setSelectedItem] = useState<string>("");

  const [recipient, setRecipient] = useState("");
  const { mintItem } = useSendTransactions();
  const params = useParams();

  const handleMint = () => {
    if (!recipient || !params.collectionId || !params.capId) return;
    mintItem({
      id: params.collectionId,
      capId: params.capId,
      baseId: recipient,
      itemType: selectedItem,
    });
  };

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
              onClick={() => {
                setMenu(item.type);
                setSelectedItem(""); // 메뉴 변경 시 선택 초기화
              }}
              className={`flex w-fit cursor-pointer items-center rounded-lg border border-black bg-gray-100 text-black hover:text-white ${
                menu === item.type && "bg-black text-white"
              }`}
            >
              <p className="w-full">{item.type}</p>
            </Button>
          ))}
        </div>

        <div className="grid h-fit w-full grid-cols-3 gap-4">
          {data.items[menu]?.map((item: any, idx: number) => (
            <div
              key={idx}
              className={`my-4 cursor-pointer rounded-2xl text-center ${
                selectedItem === item.type ? "border-4 border-blue-500" : "border border-black"
              }`}
              onClick={() => setSelectedItem(item.type)}
            >
              <img
                src={item.img_url}
                alt={item.type}
                className="aspect-square w-full rounded-2xl object-cover"
              />
              <p className="mt-1 text-sm">{item.type}</p>
            </div>
          ))}
        </div>

        {selectedItem ? (
          // MintItem 컴포넌트로 넣기
          <div className="flex w-full flex-col items-center justify-center">
            <input
              type="text"
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />

            <Button
              onClick={handleMint}
              disabled={!recipient}
              className="w-full rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              Mint Item
            </Button>
          </div>
        ) : (
          <div className="my-auto text-center text-xl">📝 Dashboard will be available Soon!</div>
        )}
      </div>
    </div>
  );
}
