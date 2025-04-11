import { Outlet, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import SelectCollectionCard from "./SelectCollectionCard";

const collections = [
  {
    id: "0x123",
    name: "Dokpami S2",
    description: "NFTs representing your identity at Yonsei's Akaraka festival.",
    img_url: "https://dokpaminft-season2.s3.us-east-1.amazonaws.com/0x123/banner.png",
  },
  {
    id: "0x456",
    name: "Yonsei Legends",
    description: "Celebrate legendary moments of your college life with NFTs.",
    img_url: "https://dokpaminft-season2.s3.us-east-1.amazonaws.com/0x456/banner.png",
  },
  {
    id: "0x789",
    name: "BlockBlock Club Members",
    description: "Exclusive collection for members of the Yonsei blockchain club.",
    img_url: "https://dokpaminft-season2.s3.us-east-1.amazonaws.com/0x789/banner.png",
  },
];

export default function CollectionsLayout() {
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("collection_id");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelect = (colId: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("collection_id", colId);

    navigate(`${location.pathname}?${newParams.toString()}`, { replace: true });
  };

  return (
    <div className="space-y-10 px-4 py-6">
      {!selectedId && <SelectCollectionCard items={collections} onClick={handleSelect} />}
      <Outlet />
    </div>
  );
}
