import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Gift, X } from "lucide-react";
import { rewards, EventReward } from "@/data/rewards";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useCheckOceanDAONFTs } from "@/hooks/useGetOceanDAONFTs";
import { useCurrentAccount, useWallets } from "@mysten/dapp-kit";
import { useConnectWallet } from "@mysten/dapp-kit";
import { useMakeOceanDAONFT } from "@/hooks/moveCall/useOceanDAONFT";
import { toast } from "sonner";

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
  const { makeOceanDAONFT, isPending, error, result } = useMakeOceanDAONFT();
  const { result: hasOceanDAONFT } = useCheckOceanDAONFTs({
    owner: account?.address || "",
  });

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
    makeOceanDAONFT({
      item: currentReward.item,
      recipient: account?.address || "",
      isNew: !hasOceanDAONFT,
    });
  };

  const handleNFTClick = (reward: EventReward) => {
    setCurrentReward(reward);
  };

  useEffect(() => {
    if (isPending) {
      toast.loading("Creating OceanDAO NFT...");
    } else if (result) {
      toast.dismiss();
      toast.success("OceanDAO NFT created successfully");
      setTimeout(() => {
        window.location.href = "/?showpopup=false";
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
            <h1 className="mb-2 text-3xl font-extrabold text-blue-800 drop-shadow-sm">
              Blockthon 2025 <span className="text-cyan-600">x</span> ExcluSuive Event
            </h1>
            <p className="mb-4 flex items-center justify-center gap-2 text-lg font-medium text-cyan-700">
              <span role="img" aria-label="water drop">
                💧
              </span>
              Move Your Code, Make It <span className="font-bold text-blue-600">Sui-per!</span>
            </p>
            <div className="mx-auto max-w-xl rounded-lg bg-blue-50/80 p-4 text-left shadow-sm">
              <p className="mb-3 flex items-center gap-2 text-base font-semibold text-blue-900">
                <span role="img" aria-label="party">
                  🎉
                </span>
                Blockthon2025에 오신 여러분을 환영합니다!
              </p>
              <p className="mb-2 text-sm text-blue-800">
                <span className="font-bold text-blue-700">Blockthon2025</span>는{" "}
                <span className="font-bold text-blue-700">
                  연세대학교 블록체인 동아리 ‘블록블록’
                </span>
                이 주최하는, 대학생 및 블록체인 개발자를 위한{" "}
                <span className="font-bold text-cyan-700">Sui 해커톤</span>입니다.
              </p>
              <ul className="mb-2 ml-4 list-disc space-y-1 text-sm text-blue-800">
                <li>비(非) Sui 개발자도 손쉽게 Sui로 온보딩할 수 있도록 설계</li>
                <li>대한민국 대학교 블록체인 동아리에서 주도하는 최초의 Sui 해커톤</li>
              </ul>
              <p className="mb-2 text-sm text-blue-800">
                <span className="font-bold text-blue-700">ExcluSuive</span>는 Blockthon2025의 공식
                파트너사로서, 참가자 여러분께 더욱 특별한 경험을 선사합니다. 참가자분들은
                Blockthon2025의 다양한 행사에 참여하며{" "}
                <span className="font-bold text-cyan-700">NFT</span>를 성장시킬 수 있습니다. 완성된
                NFT는 Blockthon2025 대면 해커톤 현장에서{" "}
                <span className="font-bold text-blue-700">실물 보상</span>으로 지급될 예정입니다.
              </p>
              <div className="mt-4 rounded bg-cyan-100/60 p-3">
                <p className="mb-2 flex items-center gap-2 text-base font-bold text-blue-900">
                  <span role="img" aria-label="calendar">
                    📅
                  </span>
                  Blockthon2025 주요 일정
                </p>
                <ul className="ml-4 list-disc space-y-1 text-sm text-blue-900">
                  <li>
                    <span className="font-semibold text-blue-700">08.11</span> Blockthon2025 Hacker
                    House
                  </li>
                  <li>
                    <span className="font-semibold text-blue-700">08.11 ~ 08.15</span> Blockthon2025
                    Online Mentoring Session
                  </li>
                  <li>
                    <span className="font-semibold text-blue-700">08.22</span> Blockthon2025 대면
                    해커톤
                  </li>
                  <li>
                    <span className="font-semibold text-blue-700">08.23</span> Blockthon2025
                    데모데이
                  </li>
                </ul>
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
            <Carousel defaultValue={currentReward.id} className="mx-auto w-full max-w-xs">
              <CarouselContent>
                {rewards.map((reward) => (
                  <CarouselItem key={reward.id} onClick={() => handleNFTClick(reward)}>
                    <div
                      className={`rounded-lg border-2 p-4 ${getRarityColor(reward.rarity)} cursor-pointer transition-all ${
                        currentReward.id === reward.id ? "shadow-lg" : "opacity-80"
                      }`}
                    >
                      <img src={reward.item.img_url} alt="loading..." className="rounded-xl" />
                      <div className="mt-2 flex items-start gap-3">
                        <div className="flex-1">
                          <div className="text-sm font-semibold">{reward.date} 보상</div>
                          <div className="mt-1 text-xs opacity-80">{reward.item.name}</div>
                          <div className="mt-1 text-xs opacity-80">{reward.item.description}</div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
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
        <div className="flex flex-col gap-3 px-4 pt-6 pb-6 sm:flex-row">
          {account ? (
            <Button
              onClick={handleClaimRewards}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white hover:from-blue-700 hover:to-cyan-700"
            >
              <Gift className="h-4 w-4" />
              Claim Reward
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
