import LoginError from "./LoginError";
import { useCurrentAccount } from "@mysten/dapp-kit";
import CollectionCard from "@/components/ManageCollection/CollectionCard";
import { Link } from "react-router-dom";
import { useGetUserOwnedCollections } from "@/hooks/useGetUserOwnedCollections";

export default function ViewCollections() {
  const account = useCurrentAccount();
  const { data, loading, error } = useGetUserOwnedCollections(account?.address || "");

  console.log(data);

  if (!account) return <LoginError />;
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data.length)
    return (
      <div className="mb-4 flex w-full justify-center">
        <Link to="/createcollection" className="px-4 py-2">
          There is no Collections
        </Link>
      </div>
    );

  return (
    <div className="pt-5 pr-18 pl-18">
      <div className="pb-2 text-5xl">View Collections</div> 

      <div className="mx-auto w-3/4">
        <div className="grid grid-cols-3 w-[680px] place-items-center gap-x-80 gap-y-10 py-10 pl-15">
          {data.map((item) => (
            <Link to={`/viewNFT/${item.collectionId}`}>
              <CollectionCard item={item}></CollectionCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
