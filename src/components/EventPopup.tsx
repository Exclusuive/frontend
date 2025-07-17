import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Clock, Star, X } from "lucide-react";
import { rewards, getCurrentReward, EventReward } from "@/data/rewards";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
  const [currentReward, setCurrentReward] = useState(getCurrentReward());
  const { makeOceanDAONFT, isPending, error, result } = useMakeOceanDAONFT();
  const { result: hasOceanDAONFT } = useCheckOceanDAONFTs({
    owner: account?.address || "",
  });
  // Update current reward when component mounts
  useEffect(() => {
    setCurrentReward(getCurrentReward());
  }, []);

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

  const getDayName = (dayOfWeek: number): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayOfWeek];
  };

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
          <div className="flex items-center justify-center gap-2 text-lg font-bold text-blue-500 md:text-3xl">
            Exclusuive x Ocean DAO
          </div>
          <div className="text-center text-lg text-blue-700">
            <img src="FinalNFT.jpg" alt="loading..." className="mx-auto w-fit rounded-xl" />
            <span className="mt-2 block text-base font-semibold text-blue-800">
              Check in daily, collect items, and complete your NFT.
              <br />
              Get a special keyring and bonus rewards on the last day!
            </span>
          </div>
        </div>
        <div className="space-y-6 px-4 pb-4">
          {/* Current Day-based Reward */}
          <div className="gap-4 rounded-lg border border-blue-200 bg-white/50 p-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-blue-700">
                <Clock className="h-5 w-5" />
                <span className="font-semibold">Today's Reward</span>
              </div>
              <div className="my-2 font-mono text-sm text-blue-900">{currentReward.item.name}</div>
            </div>
          </div>
          {/* Rewards Section */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-xl font-semibold text-blue-900">
              <Gift className="h-5 w-5 text-yellow-500" />
              All Available Rewards
            </h3>
            <Carousel className="mx-auto w-full max-w-xs">
              <CarouselContent defaultValue={currentReward.id}>
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
                          <div className="text-sm font-semibold">
                            {getDayName(reward.dayOfWeek)} - {reward.item.name}
                          </div>
                          <div className="mt-1 text-xs opacity-80">{reward.item.description}</div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
          {/* Special Benefits */}
          <div className="rounded-lg border border-blue-300 bg-gradient-to-r from-blue-100 to-cyan-100 p-4">
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
          </div>
        </div>
        <div className="flex flex-col gap-3 px-4 pt-6 pb-6 sm:flex-row">
          {account ? (
            <Button
              onClick={handleClaimRewards}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 font-semibold text-white hover:from-blue-700 hover:to-cyan-700"
            >
              <Gift className="h-4 w-4" />
              Claim Daily Rewards
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
