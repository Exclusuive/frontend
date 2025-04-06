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
    <div className="pt-5 pr-18 pl-18">
      <div className="pb-2 text-5xl">Dashboard</div>
      <div className="flex flex-wrap w-full items-center justify-between">
        <div className="text-2xl">Collections</div>
        <button
          onClick={() => navigate("/createcollection")}
          className="min-w-[200px] cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          Create a new collection
        </button>
      </div>

      <div className="mx-auto w-3/4">
        <div className="grid w-[680px] place-items-center grid-cols-2 gap-y-10 py-10">
          {data.map((item) => (
            <Link to={`/collection/${item.collectionId}/${item.capId}`}>
              <CollectionCard item={item}></CollectionCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
