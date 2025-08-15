import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Gift, X } from "lucide-react";
import { rewards, EventReward } from "@/data/rewards";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useCurrentAccount, useWallets } from "@mysten/dapp-kit";
import { useConnectWallet } from "@mysten/dapp-kit";
import { toast } from "sonner";
import { useGetBlockthon } from "@/hooks/useGetBlockthon";
import { useUserMintMemberships } from "@/hooks/moveCall/useUserMintMemberships";

interface OceanDaoEventPopupProps {
  isOpen: boolean;
  onClose: () => void;
  participantCount?: number;
  eventEndDate?: Date;
}

const EventPopup: React.FC<OceanDaoEventPopupProps> = ({ isOpen, onClose }) => {
  const account = useCurrentAccount();
  const wallets = useWallets();
  const { mutate: connect } = useConnectWallet();
  const [currentReward, setCurrentReward] = useState(rewards[0]);
  const { mintMembership, isPending, error, result } = useUserMintMemberships();
  const { hasMembership } = useGetBlockthon({
    owner: account?.address || "",
  });
  // const hasMembership = false;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "base":
        return "bg-cyan-200/40 text-cyan-800 border-cyan-300/50";
      case "legendary":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "epic":
        return "bg-purple-500/20 text-purple-700 border-purple-500/30";
      case "rare":
        return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      case "common":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      default:
        return "bg-cyan-200/40 text-cyan-800 border-cyan-300/50";
    }
  };

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

  const handleClaimRewards = () => {
    console.log(currentReward);

    mintMembership({
      membership_type: currentReward.membership_type,
      img_url: currentReward.item.img_url,
      recipient: account?.address || "",
    });
  };

  const handleNFTClick = (reward: EventReward) => {
    setCurrentReward(reward);
  };

  useEffect(() => {
    if (isPending) {
      toast.loading("Minting Membership...");
    } else if (result) {
      toast.dismiss();
      toast.success("Membership minted successfully");
      setTimeout(() => {
        window.location.href = "/Blockthon";
      }, 2000);
    } else if (error) {
      toast.dismiss();
      toast.error(error);
    }
  }, [result, error, isPending]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // body 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // 오버레이 클릭 시 닫기
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-h-[90vh] w-full max-w-4/5 overflow-y-auto rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-0 shadow-xl lg:max-w-2xl">
        {/* 닫기(X) 버튼 */}
        <button
          onClick={onClose}
          aria-label="Close popup"
          className="absolute top-3 right-3 z-10 rounded-full p-1 text-blue-500 hover:bg-blue-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <X className="h-6 w-6" />
        </button>
        {/* 기존 DialogHeader, DialogContent, DialogFooter 내용 유지 */}
        <div className="space-y-4 px-4 pt-8 pb-2 text-center">
          <div className="text-center text-lg text-blue-700">
            <img src="Event.png" alt="loading..." className="mx-auto my-4 w-fit rounded-xl" />
            <h1 className="mb-2 text-3xl font-extrabold text-black drop-shadow-sm">
              DOKPAMI Membership
            </h1>
          </div>

          {/* Welcome Message */}
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-blue-100/50 bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-6 shadow-xl backdrop-blur-sm">
              <div className="mb-4 flex items-center gap-3">
                <h2 className="text-xl font-bold text-blue-900">
                  Blockthon2025에 오신 여러분을 환영합니다! 🎉
                </h2>
              </div>

              <div className="space-y-4 text-left">
                <p className="rounded-lg border-l-4 border-blue-400 bg-white/60 p-4 text-base leading-relaxed text-blue-800">
                  <span className="font-semibold text-blue-900">독팜희</span>는 2024년 5월에 탄생해,
                  지금까지 <span className="font-bold text-blue-700">연세대학교 학생 1,000명</span>
                  이 함께하고 있는 캐릭터 커뮤니티입니다.
                  <br />
                  <br />
                  이번 Blockthon 2025를 맞아, 역대 시즌별 독팜희 멤버십이
                  <span className="font-bold text-blue-700"> 한정 재출시</span>됩니다!
                </p>

                <p className="text-sm text-blue-700 italic">
                  그동안 놓쳤던 팜희가 있다면, 이번 기회에 꼭 받아가세요! ✨
                </p>
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-cyan-100/50 bg-gradient-to-br from-cyan-50 via-white to-blue-50 p-6 shadow-xl">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-lg font-bold text-white">
                  🎁
                </div>
                <h3 className="text-xl font-bold text-cyan-900">독팜희 멤버십 리워드</h3>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center gap-3 rounded-lg border border-cyan-200/50 bg-white/80 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white">
                    1
                  </div>
                  <span className="font-medium text-cyan-800">독팜희 멤버십 키링 제공</span>
                </div>

                <div className="flex items-center gap-3 rounded-lg border border-cyan-200/50 bg-white/80 p-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-xs font-bold text-white">
                    2
                  </div>
                  <span className="font-medium text-cyan-800">랜덤 가챠 1회 무료</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6 px-4 pb-4">
          {/* Current Day-based Reward */}
          {/* <div className="gap-4 rounded-lg border border-blue-200 bg-white/50 p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Today's Reward</span>
              </div>
              <div className="my-2 font-mono text-sm text-blue-900">{currentReward.item.name}</div>
            </div>
          </div> */}
          {/* Rewards Section */}
          <div className="my-4 space-y-4">
            {/* <h3 className="flex items-center gap-2 text-xl font-semibold text-blue-900">
              <Gift className="h-5 w-5 text-yellow-500" />
              All Available Rewards
            </h3> */}
            <div className="relative mx-auto w-full max-w-xs">
              <Carousel defaultValue={currentReward.id} className="w-full">
                <CarouselContent>
                  {rewards.map((reward) => (
                    <CarouselItem key={reward.id} onClick={() => handleNFTClick(reward)}>
                      <div
                        className={`rounded-lg border-2 p-4 ${getRarityColor(reward.rarity)} cursor-pointer transition-all ${
                          currentReward.id === reward.id ? "shadow-lg" : "opacity-90"
                        }`}
                      >
                        <img src={reward.item.img_url} alt="loading..." className="rounded-xl" />
                        <div className="mt-2 flex items-start gap-3">
                          <div className="flex-1">
                            <div className="text-sm font-semibold">{reward.item.name}</div>
                            <div className="mt-1 text-xs opacity-80">{reward.item.description}</div>
                          </div>
                        </div>
                        <Button
                          disabled={currentReward.id === reward.id}
                          className="mx-auto mt-4 w-full bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white hover:from-blue-700 hover:to-cyan-700"
                        >
                          {currentReward.id === reward.id ? "선택됨" : "선택하기"}
                        </Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-2 -translate-y-1/2 border-cyan-200 bg-white/80 text-cyan-700 hover:bg-white hover:text-cyan-800" />
                <CarouselNext className="absolute top-1/2 right-2 -translate-y-1/2 border-cyan-200 bg-white/80 text-cyan-700 hover:bg-white hover:text-cyan-800" />
              </Carousel>
            </div>
          </div>
          {/* Special Benefits */}
          {/* <div className="rounded-lg border border-blue-300 bg-gradient-to-r from-blue-100 to-cyan-100 p-4">
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-blue-900">
              <Star className="h-5 w-5 text-yellow-500" />
              Exclusive OceanDao NFT Benefits
            </h4>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Get a special keyring on the last day!
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Offering pro plan for free
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                Surprise bonus for active participants!
              </li>
            </ul>
          </div> */}
        </div>
        <div className="flex flex-col gap-3 px-4 pb-6 sm:flex-row">
          {account ? (
            <Button
              onClick={handleClaimRewards}
              disabled={hasMembership}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white hover:from-blue-700 hover:to-cyan-700"
            >
              <Gift className="h-4 w-4" />
              {hasMembership ? "멤버십을 이미 받았어요." : "멤버십 받기"}
            </Button>
          ) : (
            <Button
              onClick={handleLogin}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white hover:from-blue-700 hover:to-cyan-700"
            >
              <Gift className="h-4 w-4" />
              Connect Wallet to join the event
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPopup;
