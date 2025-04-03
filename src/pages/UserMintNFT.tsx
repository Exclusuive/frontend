import { Button } from "@/components/ui/button";
import { useCheckUserNFTs } from "@/hooks/useCheckUserNFTs";
import { useWallets, useCurrentAccount, useConnectWallet } from "@mysten/dapp-kit";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

export default function UserMintNFTs() {
  const account = useCurrentAccount();
  const wallets = useWallets();

  const { mutate: connect } = useConnectWallet();
  const params = useParams();
  const { data } = useCheckUserNFTs(account?.address || "", params.collectionId);
  const [selectedId, setSelectedId] = useState("");
  const selectedNFT = data?.find((nft: any) => nft.id === selectedId);

  const handleMintBase = () => {
    console.log("Minting base NFT...");
    // TODO: 실제 mint base NFT 로직 추가
  };

  const handleMintItem = () => {
    console.log("Minting item NFT...");
    // TODO: 실제 mint item NFT 로직 추가
  };

  return (
    <div className="mx-auto flex h-screen w-full max-w-[600px] flex-col items-center justify-between bg-white p-4 shadow-lg">
      {/* 상단 로고 및 제목 */}
      <Link to={"/"}>
        <h1 className="text-center text-lg font-bold text-gray-700">Exclusuive Dashboard</h1>
      </Link>

      <div>
        {!account && (
          <div className="my-10">
            <Button
              className="w-full bg-white text-black hover:text-white"
              onClick={() =>
                connect(
                  { wallet: wallets[0] },
                  {
                    onSuccess: () => console.log("connected"),
                  }
                )
              }
            >
              Connect wallet
            </Button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center space-y-4">
        {account && (
          <>
            {!data || data.length === 0 ? (
              <div className="text-center">
                <p className="mb-4 text-gray-700">You should mint base NFT first</p>
                <Button onClick={handleMintBase}>Mint Base</Button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
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

                <Button onClick={handleMintItem} disabled={!selectedId}>
                  Mint Item
                </Button>
              </div> // ← 이게 빠져 있었음
            )}
          </>
        )}
      </div>

      <div>Block Block</div>
    </div>
  );
}
