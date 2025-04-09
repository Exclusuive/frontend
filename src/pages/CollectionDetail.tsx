import CollectionDashboard from "@/components/CollectionDetail/CollectionDashboard";
import EditCollectionInfo from "@/components/CollectionDetail/EditCollectionInfo";
import ManageItem from "@/components/CollectionDetail/ManageItem";
import MintBase from "@/components/CollectionDetail/MintBase";
import { Button } from "@/components/ui/button";
import { useGetCollectionInfo } from "@/hooks/useGetCollectionInfo";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function CollectionDetail() {
  const [menu, setMenu] = useState("Dashboard");

  const params = useParams();
  const { data, loading, error } = useGetCollectionInfo(params.collectionId || "");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error occurred: {error.message}</p>;
  if (!data) return <p>Collection not found.</p>;

  // 👉 각 메뉴에 대응하는 컴포넌트 정의
  const EditMintingRules = () => <div className="text-white">⚙️ Edit Minting Rules</div>;

  // ✅ menuItems 배열 안에 컴포넌트 포함
  const menuItems = [
    { name: "Dashboard", component: <CollectionDashboard data={data} /> },
    { name: "Collection Info", component: <EditCollectionInfo data={data} /> },
    { name: "Base", component: <MintBase /> },
    { name: "Item", component: <ManageItem data={data} /> },
    // { name: "Mint Item NFT", component: <MintItem data={data} /> },
    { name: "Supply Machine", component: <EditMintingRules /> },
  ];

  // 현재 선택된 메뉴에 해당하는 컴포넌트 찾기
  const selected = menuItems.find((item) => item.name === menu);

  return (
    <div className="flex h-full w-full flex-col items-center text-center">
      <div className="flex w-full flex-wrap justify-center gap-x-5 gap-y-2 py-10">
        {menuItems.map((item) => (
          <Button
            key={item.name}
            onClick={() => setMenu(item.name)}
            className={`flex w-fit cursor-pointer items-center rounded-lg bg-gray-100 text-black hover:text-white ${
              menu === item.name && "bg-black text-white"
            }`}
          >
            <p className="w-full">{item.name}</p>
          </Button>
        ))}
      </div>

      <div className="w-3/4 rounded-lg bg-gray-100 p-10 shadow-md">
        {selected?.component ?? <div className="text-white">Unknown Page</div>}
      </div>
    </div>
  );
}
