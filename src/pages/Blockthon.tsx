import { useGetBlockthon } from "@/hooks/useGetBlockthon";
import { useCurrentAccount, useWallets } from "@mysten/dapp-kit";
import { useConnectWallet } from "@mysten/dapp-kit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { rewards } from "@/data/rewards";
import { Button } from "@/components/ui/button";
import { Gift } from "lucide-react";

const Blockthon = () => {
  const account = useCurrentAccount();
  const { result } = useGetBlockthon({
    owner: account?.address || "",
  });

  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const handleLogin = () => {
    const wallet = wallets.find((w) => w.name.includes("Slush"))
      ? wallets.find((w) => w.name.includes("Slush"))
      : wallets[0];

    if (wallet) {
      connect(
        { wallet },
        {
          onSuccess: () => {},
          onError: () => {
            window.alert("Failed to connect wallet");
          },
        },
      );
    }
  };

  // Check if user has account
  if (!account) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Blockthon 참여</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Blockthon 이벤트에 참여하려면 먼저 로그인해주세요.
            </p>
            <div className="flex justify-center">
              <Button
                onClick={handleLogin}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white hover:from-blue-700 hover:to-cyan-700"
              >
                <Gift className="h-4 w-4" />
                Connect Wallet to join the event
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user has memberships
  if (!result || result.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">멤버십 필요</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">
              Blockthon 이벤트에 참여하려면 멤버십이 필요합니다.
            </p>
            <div className="flex justify-center">
              먼저 NFC 카드를 태그하고 <span className="font-bold">SUI</span>를 받아가세요.
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Get first membership
  const firstMembership = result[0];
  const selectedReward = rewards.find(
    (reward) => reward.membership_type === firstMembership.membership_type,
  );

  console.log(firstMembership);

  // Mock gacha participation status (you can replace this with actual data)
  const hasParticipatedInGacha = true; // This should come from your actual data source

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-4xl">
        <div className="my-4 flex items-center justify-center">
          <Link
            to="/"
            className="font-Exclusuive w-full text-center text-[28px] font-bold tracking-wider"
          >
            Exclu
            <span className="inline-block -translate-y-2 font-extrabold text-[#4DA2FF]">Sui</span>
            ve
          </Link>
        </div>

        <div className="mx-auto max-w-xl">
          {/* Membership Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-800">내 멤버십 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                {firstMembership.image_url ? (
                  <img
                    src={firstMembership.image_url}
                    alt={firstMembership.membership_type}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-2xl text-gray-500">🎫</div>
                )}
                <div>
                  <p className="text-bold text-gray-800">
                    🎫 멤버십 종류: {firstMembership.membership_type}
                  </p>
                  <p className="my-4 text-gray-600">{selectedReward?.item.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <p className="mt-2 text-center text-gray-600">
            {hasParticipatedInGacha && (
              <p className="mt-2 text-center text-gray-600">
                아직 가챠 활동에 참여하지 않았습니다. <br />
                <span className="font-bold">어서 참여해보세요!</span>
              </p>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blockthon;
