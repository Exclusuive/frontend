import { ZkSendLink } from "@mysten/zksend";
import { Button } from "@/components/ui/button";
import { useCurrentAccount, useConnectWallet, useWallets } from "@mysten/dapp-kit";
import { claimAssets } from "@/lib/zkSend";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { paths } from "@/config/paths";

const ZkSend = () => {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [isClaimed, setIsClaimed] = useState(false);

  console.log(account);

  const onClaim = async () => {
    try {
      setIsLoading(true);
      const link = await ZkSendLink.fromUrl(window.location.href);
      const tx = await link.createClaimTransaction(account?.address ?? "");
      await claimAssets(tx as any, account?.address ?? "", link.keypair as any);
      setIsClaimed(true);
    } catch (error) {
      if (error instanceof Error && error.message.includes("Wrong secretKey size")) {
        toast.error("잘못된 링크예요. 올바른 링크인지 확인해주세요.");
      } else if (
        error instanceof Error &&
        error.message.includes("Failed to create sponsored transaction")
      ) {
        toast.error("이미 다른 사람이 받은 링크에요. 다른 링크를 사용해주세요.");
      } else if (error instanceof Error && error.message.includes("Failed to fetch")) {
        toast.error("네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
      } else {
        toast.error("알 수 없는 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#4DA2FF] p-4">
      <div className="w-full max-w-md">
        {/* Main Content Card */}
        <div className="rounded-3xl border border-gray-600 bg-white p-8 shadow-xl">
          {/* Logo/Brand Section */}
          <div className="mb-8 text-center">
            <h1 className="font-Exclusuive text-[40px] font-bold tracking-wider text-gray-800">
              Exclu
              <span className="inline-block -translate-y-2 font-extrabold text-[#4DA2FF]">Sui</span>
              ve
            </h1>
            <div className="mx-auto h-1 w-16 rounded-full bg-gray-800" />
          </div>

          {/* Promotional Text */}
          <div className="mb-8 text-center text-gray-800">
            <p className="mb-4 text-[18px] font-semibold text-gray-700">
              Blockthon 2025에서만 만날 수 있는 <br /> 특별한 경험!
            </p>
            <ul className="flex flex-col items-center justify-center gap-2 text-[15px] font-bold">
              <li>
                <span className="mr-1 rounded-full px-2 py-0.5 text-sm text-black">①</span>
                NFC 카드를 태그하고{" "}
                <span className="text-[#4DA2FF] underline underline-offset-4">SUI</span>를
                받아가세요.
              </li>
              <li>
                <span className="mr-1 rounded-full px-2 py-0.5 text-sm text-black">②</span>
                받은 <span className="text-[#4DA2FF] underline underline-offset-4">SUI</span>로{" "}
                <span className="font-extrabold text-gray-900">ExcluSuive 멤버십</span>에 가입!
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
            {account ? (
              <Button
                onClick={onClaim}
                disabled={isLoading}
                className="w-full transform cursor-pointer rounded-2xl px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02]"
                style={{ backgroundColor: "#4DA2FF" }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                    <span>Claiming...</span>
                  </div>
                ) : (
                  "SUI 받고 이벤트 참여하기"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleConnectWallet}
                className="w-full transform rounded-2xl px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02]"
                style={{ backgroundColor: "#4DA2FF" }}
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
          <p className="text-xs text-gray-400">Powered by ExcluSUive</p>
        </div>
      </div>
      <ClaimedDialog isOpen={isClaimed} onClose={() => setIsClaimed(false)} />
    </div>
  );
};

export default ZkSend;

const ClaimedDialog = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">🎉 축하합니다! 0.1 SUI 획득! 🎁</DialogTitle>
          <p className="mt-2 text-center text-base text-gray-600">
            이벤트에 참여해 주셔서 감사합니다.
            <br />
            이제 멤버십을 받아 특별한 혜택을 즐겨보세요.
          </p>
        </DialogHeader>
        <DialogFooter>
          <Link to={paths.landingPage.getHref()} className="w-full">
            <Button
              className="w-full transform rounded-2xl bg-[#4DA2FF] px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-[1.02]"
              onClick={onClose}
            >
              🚀 멤버십 받으러 가기
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
