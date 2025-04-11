import { useState } from "react";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { useGetSupplyMachines } from "@/hooks/useGetSupplyMachineInfo";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function SupplyMachine() {
  const { createSupplier, addSelection } = useSendTransactions();
  const params = useParams();
  const account = useCurrentAccount();
  const [menu, setMenu] = useState("");
  const [selectedItem, setSelectedItem] = useState({ supplyId: "", capId: "" });
  const [price, setPrice] = useState(0);

  const { data, loading, error } = useGetSupplyMachines(account?.address || "");

  const handleCreate = () => {
    if (!params.collectionId || !params.capId) return;
    createSupplier({
      id: params.collectionId,
      capId: params.capId,
    });
  };

  const handleAddSelection = () => {
    if (!params.collectionId || !params.capId) return;
    addSelection({
      collectionId: params.collectionId!,
      supplyId: selectedItem.supplyId!,
      supplyCapId: selectedItem.capId!,
      price: price,
    });
  };

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-lg bg-white p-6 shadow-md">
      <Button
        onClick={handleCreate}
        className="w-full rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
      >
        Create Supply Machine
      </Button>

      <div className="flex w-full flex-wrap justify-center gap-x-5">
        {data.map((item: any) => (
          <Button
            key={item.name}
            onClick={() => {
              setMenu(item.name);
              setSelectedItem(item); // 메뉴 변경 시 선택 초기화
            }}
            className={`flex w-fit cursor-pointer items-center rounded-lg border border-black bg-gray-100 text-black hover:text-white ${
              menu === item.name && "bg-black text-white"
            }`}
          >
            <p className="w-full">{item.name}</p>
          </Button>
        ))}

        <label className="mb-2 block font-semibold text-gray-700">Price</label>
        <input
          type="text"
          className="w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="0x..."
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />

        <Button
          onClick={handleAddSelection}
          className="my-6 w-full rounded-lg bg-green-500 px-6 py-2 text-white hover:bg-green-600 disabled:opacity-50"
        >
          Mint Item
        </Button>
      </div>
    </div>
  );
}
