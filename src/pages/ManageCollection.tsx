import { useGetUserManageCollections } from "@/hooks/useGetUserManageCollections";
import LoginError from "./LoginError";
import { useCurrentAccount } from "@mysten/dapp-kit";
import CollectionCard from "@/components/ManageCollection/CollectionCard";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const account = useCurrentAccount();
  const { data, loading, error } = useGetUserManageCollections(account?.address || "");
  const navigate = useNavigate();

  if (!account) return <LoginError />;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data.length)
    return (
      <div className="mb-4 flex w-full justify-center">
        <Link to="/createcollection" className="px-4 py-2">
          Create Collections
        </Link>
      </div>
    );

  return (
    <div className="pt-5 pl-18 pr-18">
      <div className="text-4xl pb-2">Dashboard</div>
      <div className="flex justify-between w-full items-center">
        <div className="text-xl">Collections</div>
        <button
          onClick={() => navigate("/createcollectionpage")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Create a new collection
        </button>
      </div>
      
      <div className="mx-auto w-3/4">

        <div className="grid w-full grid-cols-2 justify-center gap-x-10 py-10">
          {data.map((item) => (
            <CollectionCard item={item}></CollectionCard>
          ))}
        </div>
      </div>
    </div>
  );
}
