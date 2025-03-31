import { useGetUserManageCollections } from "@/hooks/useGetUserManageCollections";
import LoginError from "./LoginError";
import { useCurrentAccount } from "@mysten/dapp-kit";
import CollectionCard from "@/components/ManageCollection/CollectionCard";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const account = useCurrentAccount();
  const { data, loading, error } = useGetUserManageCollections(account?.address || "");

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
    <div className="h-full w-full p-6">
      <p className="text-[40px] font-bold">Manage Collections</p>

      <div className="mx-auto w-full">
        <div className="mb-4 flex w-full justify-end">
          <Link to="/createcollection" className="px-4 py-2">
            Create Collections
          </Link>
        </div>
        <div className="grid w-full grid-cols-2 justify-center gap-x-10 py-10">
          {data.map((item) => (
            <CollectionCard item={item}></CollectionCard>
          ))}
        </div>
      </div>
    </div>
  );
}
