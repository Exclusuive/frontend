// import { useGetUserOwnedCollections } from "@/hooks/useGetUserOwnedCollections";
import { useCurrentAccount, useSuiClientQuery } from "@mysten/dapp-kit";
export default function Collection() {
  const PACKAGE_ID = import.meta.env.VITE_PACKAGE_ID;
  const COL_CAP_TYPE = `${PACKAGE_ID}::collection::CollectionCap`;
  const account = useCurrentAccount();

  if (!account) return <div>Hello It's Collection. Please Connect Wallet</div>;

  const { data, isPending, error } = useSuiClientQuery("getOwnedObjects", {
    owner: account?.address,
    filter: { StructType: COL_CAP_TYPE },
    options: {
      showType: true,
      showContent: true,
    },
  });

  if (isPending) return <div>Loading...</div>;

  if (error) return <div>Error: {error?.message || "error"}</div>;

  // const { data } = useGetUserOwnedCollections(account?.address || "");

  return (
    <div>
      <h1>Hello It's Collection</h1>
      {/* <div className="overflow-scroll">{JSON.stringify(data)}</div> */}
    </div>
  );
}
