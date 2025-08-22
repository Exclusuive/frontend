import { Button } from "@/components/ui/button";
import { useCurrentAccount, useConnectWallet, useWallets } from "@mysten/dapp-kit";
import { useEffect, useState } from "react";
import { useCheckMembership } from "@/hooks/useCheckMembership";
import { useJoinGatcha } from "@/hooks/moveCall/useJoinGatcha";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const Gatcha = () => {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const { userHasMembership, membership_id } = useCheckMembership({
    owner: account?.address ?? "",
  });
  const { joinGatcha, result } = useJoinGatcha();
  const joined_Gatcha = localStorage.getItem("joined_gatcha");

  const [trigger, setTrigger] = useState(true);

  console.log(userHasMembership, membership_id, joined_Gatcha);

  const handleConnectWallet = () => {
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

  useEffect(() => {
    if (account) {
      if (userHasMembership) {
        joinGatcha({
          membership_id: membership_id ?? "",
          isNew: joined_Gatcha !== "true",
        });
      } else {
        window.alert("먼저 멤버십을 받아주세요!");
      }
    }
  }, [account, userHasMembership]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        {/* Main Content Card */}
        <div className="rounded-3xl border border-blue-200 bg-white p-8 shadow-xl">
          {/* Logo/Brand Section */}
          <div className="mb-8 text-center">
            <h1 className="font-Exclusuive text-[40px] font-bold tracking-wider text-gray-800">
              Exclu
              <span className="inline-block -translate-y-2 font-extrabold text-[#4DA2FF]">Sui</span>
              ve
            </h1>
            <div className="mx-auto h-1 w-16 rounded-full bg-blue-600" />
          </div>

          {/* Promotional Text */}
          <div className="mb-8 text-center text-gray-800">
            <p className="mb-4 text-[18px] font-semibold text-gray-700">
              Blockthon 2025에서만 만날 수 있는 <br /> 특별한 경험!
            </p>
            <ul className="flex flex-col items-center justify-center gap-2 text-[15px] font-bold">
              <li>
                <span className="mr-1 rounded-full px-2 py-0.5 text-sm text-black">①</span>
                NFC 카드를 태그하고
                <br />
                <span className="text-blue-600 underline-offset-4">SUI와 ExcluSUive 멤버십</span>을
                받아가세요.
              </li>

              <li>
                <span className="mr-1 rounded-full px-2 py-0.5 text-sm text-black">③</span>
                <span className="font-extrabold text-gray-900">독팜희 키링</span> &{" "}
                <span className="font-extrabold text-gray-900">가챠</span>를 무료로 받아가세요!
              </li>
            </ul>
          </div>

          {/* Action Section */}
          <div className="space-y-4">
            {!account && (
              <Button
                onClick={handleConnectWallet}
                className="w-full transform rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-blue-700 hover:to-cyan-700"
              >
                Connect Wallet
              </Button>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              Looking for <span className="font-semibold text-gray-800">ExcluSuive</span> Experience
              for your Event?
            </p>
            <p className="mt-2 text-base font-semibold text-gray-800">
              Contact Us.
              <a
                href="mailto:exclusuive@gmail.com"
                className="ml-1 text-blue-800 underline underline-offset-4"
              >
                exclusuive@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-blue-400">Powered by ExcluSUive</p>
        </div>
        <ClaimedDialog
          isOpen={result && trigger}
          onClose={() => {
            setTrigger(false);
          }}
        />
      </div>
    </div>
  );
};

export default Gatcha;

const ClaimedDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">🎊✨ 가챠에 참여 성공! ✨🎊</DialogTitle>
          <p className="mt-2 text-center text-base font-semibold text-gray-700">
            이벤트에 참여해 주셔서 정말 감사합니다.
            <br />
            <span className="text-lg font-bold text-blue-600">
              지금 이 화면을 보여주고
              <br />
              행운의 경품을 받아가세요! 🎁
            </span>
            <br />
            <span className="mt-2 block animate-bounce text-pink-500">행운이 함께하길! 🍀</span>
          </p>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
