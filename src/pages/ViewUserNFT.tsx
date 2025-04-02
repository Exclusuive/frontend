import { useCheckUserNFTs } from "@/hooks/useCheckUserNFTs";
import { useGetNFTInfo } from "@/hooks/useGetNFTInfo";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ViewUserNFT() {
  const params = useParams();
  const account = useCurrentAccount();
  const [selectedId, setSelectedId] = useState("");

  const { data, loading, error } = useCheckUserNFTs(
    account?.address || "",
    params.collectionId || ""
  );

  const selectedNFT = data?.find((nft: any) => nft.id === selectedId);

  const { data: result, loading: loading2, error: error2 } = useGetNFTInfo(selectedId);

  console.log(result);
  useEffect(() => {
    if (!selectedNFT) return;
  }, [selectedNFT]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error occurred: {error.message}</p>;
  if (!data) return <p>Collection not found.</p>;

  return (
    <div className="mx-auto my-auto min-h-3/4 w-3/4 rounded-lg bg-gray-100 p-10 shadow-md">
      <div className="grid h-full grid-cols-1 gap-x-8 text-start xl:grid-cols-2">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-start font-extrabold">My NFTs</div>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="rounded border px-4 py-2 shadow"
          >
            <option value="">Select your NFT ID</option>
            {data.map((nft: any) => (
              <option key={nft.id} value={nft.id}>
                {nft.id}
              </option>
            ))}
          </select>

          {selectedNFT && (
            <img
              src={selectedNFT.img_url}
              alt={`NFT ${selectedNFT.id}`}
              className="h-48 w-48 rounded-lg border shadow"
            />
          )}

          <div>My Items</div>
          {result && (
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
          )}
        </div>
      </div>
    </div>
  );
}
