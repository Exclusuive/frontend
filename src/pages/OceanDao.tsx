import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Gift, Sparkles, Calendar, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

interface DayEvent {
  day: number;
  title: string;
  description: string;
  nftImage: string;
  nftName: string;
  isCompleted: boolean;
  isAvailable: boolean;
}

const OceanDao: React.FC = () => {
  const [currentDay, setCurrentDay] = useState(1);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [showNFTAnimation, setShowNFTAnimation] = useState(false);
  const [currentNFT, setCurrentNFT] = useState<DayEvent | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const eventDays: DayEvent[] = [
    {
      day: 1,
      title: "Ocean Dao 첫 번째 날",
      description: "바다의 첫 번째 선물을 받아보세요",
      nftImage: "🌊",
      nftName: "Ocean Wave NFT",
      isCompleted: false,
      isAvailable: true,
    },
    {
      day: 2,
      title: "Ocean Dao 두 번째 날",
      description: "깊은 바다의 비밀을 발견하세요",
      nftImage: "🐠",
      nftName: "Deep Sea Fish NFT",
      isCompleted: false,
      isAvailable: false,
    },
    {
      day: 3,
      title: "Ocean Dao 세 번째 날",
      description: "산호초의 아름다움을 만나보세요",
      nftImage: "🪸",
      nftName: "Coral Reef NFT",
      isCompleted: false,
      isAvailable: false,
    },
    {
      day: 4,
      title: "Ocean Dao 네 번째 날",
      description: "바다의 보물을 찾아보세요",
      nftImage: "💎",
      nftName: "Ocean Treasure NFT",
      isCompleted: false,
      isAvailable: false,
    },
    {
      day: 5,
      title: "Ocean Dao 마지막 날",
      description: "바다의 왕관을 받으세요",
      nftImage: "👑",
      nftName: "Ocean Crown NFT",
      isCompleted: false,
      isAvailable: false,
    },
  ];

  useEffect(() => {
    // 로컬 스토리지에서 완료된 날짜들 불러오기
    const savedCompletedDays = localStorage.getItem("oceanDaoCompletedDays");
    if (savedCompletedDays) {
      setCompletedDays(JSON.parse(savedCompletedDays));
    }
  }, []);

  useEffect(() => {
    // 완료된 날짜들을 로컬 스토리지에 저장
    localStorage.setItem("oceanDaoCompletedDays", JSON.stringify(completedDays));
  }, [completedDays]);

  const handleAttendance = (day: number) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const dayEvent = eventDays.find((event) => event.day === day);

    if (dayEvent && !completedDays.includes(day)) {
      setCurrentNFT(dayEvent);
      setShowNFTAnimation(true);

      // NFT 애니메이션 후 완료 처리
      setTimeout(() => {
        setCompletedDays((prev) => [...prev, day]);
        setShowNFTAnimation(false);
        setCurrentNFT(null);
        setIsAnimating(false);
      }, 3000);
    }
  };

  const getAvailableDays = () => {
    return eventDays.map((event) => ({
      ...event,
      isAvailable: event.day <= currentDay,
      isCompleted: completedDays.includes(event.day),
    }));
  };

  const availableEvents = getAvailableDays();
  const totalCompleted = completedDays.length;
  const progressPercentage = (totalCompleted / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-4 md:p-8">
      {/* 헤더 */}
      <div className="mx-auto mb-8 max-w-6xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-4xl font-bold text-transparent md:text-6xl">
            Ocean Dao Event
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            바다의 선물을 받아보세요! 5일간 매일 새로운 NFT를 받을 수 있습니다.
          </p>

          {/* 진행률 표시 */}
          <div className="mb-8 rounded-lg bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <span className="text-lg font-semibold">진행률</span>
              </div>
              <Badge variant="secondary" className="text-sm">
                {totalCompleted}/5 완료
              </Badge>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 이벤트 카드들 */}
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {availableEvents.map((event) => (
            <Card
              key={event.day}
              className={cn(
                "transition-all duration-300 hover:shadow-lg",
                event.isCompleted
                  ? "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50"
                  : event.isAvailable
                    ? "bg-white hover:shadow-xl"
                    : "bg-gray-100 opacity-60",
              )}
            >
              <CardHeader className="pb-4 text-center">
                <div className="mb-2 flex items-center justify-center">
                  <Calendar className="mr-2 h-5 w-5 text-blue-500" />
                  <CardTitle className="text-xl">Day {event.day}</CardTitle>
                </div>
                {event.isCompleted && (
                  <Badge className="bg-green-500 text-white">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    완료
                  </Badge>
                )}
              </CardHeader>

              <CardContent className="text-center">
                <div className="mb-4">
                  <div className="mb-2 text-6xl">{event.nftImage}</div>
                  <h3 className="mb-1 text-lg font-semibold">{event.title}</h3>
                  <p className="mb-3 text-sm text-gray-600">{event.description}</p>
                  <p className="text-sm font-medium text-blue-600">{event.nftName}</p>
                </div>

                <Button
                  onClick={() => handleAttendance(event.day)}
                  disabled={!event.isAvailable || event.isCompleted || isAnimating}
                  className={cn(
                    "w-full transition-all duration-200",
                    event.isCompleted
                      ? "bg-green-500 hover:bg-green-600"
                      : event.isAvailable
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
                        : "cursor-not-allowed bg-gray-300",
                  )}
                >
                  {event.isCompleted ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      완료됨
                    </>
                  ) : event.isAvailable ? (
                    <>
                      <Gift className="mr-2 h-4 w-4" />
                      출석하기
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      대기중
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* NFT 전송 애니메이션 */}
      {showNFTAnimation && currentNFT && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="animate-in zoom-in-95 mx-4 max-w-md rounded-2xl bg-white p-8 text-center duration-300">
            <div className="mb-6">
              <div className="mb-4 animate-bounce text-8xl">{currentNFT.nftImage}</div>
              <h3 className="mb-2 text-2xl font-bold">{currentNFT.nftName}</h3>
              <p className="text-gray-600">{currentNFT.description}</p>
            </div>

            <div className="mb-6 flex items-center justify-center">
              <div className="animate-pulse">
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>
              <span className="ml-2 text-lg font-semibold text-green-600">NFT 전송 중...</span>
            </div>

            <div className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 text-white">
              <CheckCircle className="mx-auto mb-2 h-6 w-6" />
              <p className="font-semibold">성공적으로 전송되었습니다!</p>
            </div>
          </div>
        </div>
      )}

      {/* 완료 축하 메시지 */}
      {totalCompleted === 5 && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <div className="animate-in zoom-in-95 mx-4 max-w-md rounded-2xl bg-white p-8 text-center duration-300">
            <div className="mb-4 text-8xl">🎉</div>
            <h3 className="mb-4 text-2xl font-bold">축하합니다!</h3>
            <p className="mb-6 text-gray-600">
              Ocean Dao 이벤트를 모두 완료하셨습니다!
              <br />
              모든 NFT를 성공적으로 받으셨습니다.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
            >
              다시 시작하기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OceanDao;
