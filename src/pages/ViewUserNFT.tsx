import { Button } from "@/components/ui/button";
import { useCheckUserBases } from "@/hooks/useCheckUserBases";
import { useGetBaseInfo } from "@/hooks/useGetBaseInfo";
import { useGetCollectionInfo } from "@/hooks/useGetCollectionInfo";
import { useGetItemInfo } from "@/hooks/useGetItemInfo";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewUserNFT() {
  const params = useParams();
  const account = useCurrentAccount();
  const [selectedItem, setSelectedItem] = useState<string>("");
  const [selectedId, setSelectedId] = useState("");
  const { equipItem } = useSendTransactions();

  const { data, loading, error } = useCheckUserBases(
    account?.address || "",
    params.collectionId || ""
  );
  const { data: account_item_data } = useGetItemInfo(account?.address!, params.collectionId!);
  const [menu, setMenu] = useState(Object.keys(account_item_data)[0]);

  const selectedNFT = data?.find((nft: any) => nft.id === selectedId);
  const { data: base_data } = useGetBaseInfo(selectedNFT?.id || "");

  const handleEquip = () => {
    if (!params.collectionId || !selectedNFT || !selectedId) return;
    equipItem({
      id: params.collectionId,
      baseId: selectedNFT.id,
      itemId: selectedItem,
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error occurred: {error.message}</p>;
  if (!data) return <p>Collection not found.</p>;

  return (
    <div className="mx-auto my-auto min-h-3/4 w-3/4 rounded-lg bg-gray-100 p-10 shadow-md">
      <div className="grid h-full grid-cols-1 gap-x-8 text-start xl:grid-cols-2">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-start font-extrabold">My NFTs</div>

          {selectedNFT && (
            <img
              src={selectedNFT.img_url}
              alt={`NFT ${selectedNFT.id}`}
              className="h-48 w-48 rounded-lg border shadow"
            />
          )}
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full rounded border px-4 py-2 shadow"
          >
            <option value="">Select your NFT ID</option>
            {data.map((nft: any) => (
              <option key={nft.id} value={nft.id}>
                {nft.id}
              </option>
            ))}
          </select>

          {/* {result && (
            <div className="mt-4 w-full rounded bg-white p-4 shadow">
              <h3 className="mb-2 text-lg font-semibold">Layer Info</h3>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(result).map(([layerName, itemInfo]: [string, any]) => (
                  <div
                    key={layerName}
                    className="rounded-xl border bg-white p-4 shadow transition-all duration-200 hover:shadow-md"
                  >
                    <div className="mb-2 text-sm font-semibold text-gray-500">{layerName}</div>
                    <img
                      src={itemInfo.img_url}
                      alt={`${layerName} - ${itemInfo.type}`}
                      className="mb-3 h-30 w-full rounded-lg object-cover"
                    />
                    <div className="text-md font-bold text-gray-800">{itemInfo.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>

        <div>
          <h2 className="font-bold">Items in Account</h2>
          <div className="flex w-full flex-wrap justify-center gap-x-5">
            {Object.keys(account_item_data).map((item: any) => (
              <Button
                key={item}
                onClick={() => {
                  setMenu(item);
                  setSelectedItem(""); // 메뉴 변경 시 선택 초기화
                }}
                className={`flex w-fit cursor-pointer items-center rounded-lg border border-black bg-gray-100 text-black hover:text-white ${
                  menu === item && "bg-black text-white"
                }`}
              >
                <p className="w-full">{item}</p>
              </Button>
            ))}
          </div>

          <div className="grid h-fit w-full grid-cols-3 gap-4">
            {account_item_data[menu]?.map((item: any, idx: number) => (
              <div
                key={idx}
                className={`my-4 cursor-pointer rounded-2xl text-center ${
                  selectedItem === item.id ? "border-4 border-blue-500" : "border border-black"
                }`}
                onClick={() => setSelectedItem(item.id)}
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

          <Button
            onClick={handleEquip}
            disabled={!selectedItem}
            className="w-full rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
          >
            Equip Item to Base
          </Button>
        </div>
      </div>
    </div>
  );
}
