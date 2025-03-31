import { Button } from "@/components/ui/button";
import { useCheckUserNFTs } from "@/hooks/useCheckUserNFTs";
import { useWallets, useCurrentAccount, useConnectWallet } from "@mysten/dapp-kit";
import { Link, useParams } from "react-router-dom";

export default function UserMintNFTs() {
  const account = useCurrentAccount();
  const wallets = useWallets();

  const { mutate: connect } = useConnectWallet();
  const params = useParams();
  const { data } = useCheckUserNFTs(account?.address || "", params.collectionId);
  //   const { data, loading, error } = useCollectionDetail(params.collectionId || "");

  console.log(data);

  return (
    <div className="mx-auto flex h-screen w-full max-w-[600px] flex-col items-center justify-between bg-white p-4 shadow-lg">
      {/* 상단 로고 및 제목 */}
      <Link to={"/"}>
        <h1 className="text-center text-lg font-bold text-gray-700">Exclusuive Dashboard</h1>
      </Link>
      <div>
        <img src="/basic.png" alt="profile" className="mx-auto my-4 h-32 w-32" />
        {account ? (
          <div>
            <p className="my-5 text-center text-lg font-bold">{account.label}</p>
          </div>
        ) : (
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

      <div>Block Block</div>
    </div>
  );
}
