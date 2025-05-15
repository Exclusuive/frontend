import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useCurrentAccount, ConnectButton } from "@mysten/dapp-kit";
import { useBuyProduct } from "@/hooks/moveCall/store";

const exampleCardContent = [
  { name: "갓생 팜희", image: "/Life.jpg" },
  { name: "인싸 팜희", image: "/Friend.jpg" },
  { name: "욜로 팜희", image: "/Yolo.jpg" },
  { name: "연애 팜희", image: "/Love.jpg" },
  { name: "집순 팜희", image: "/Home.jpg" },
  { name: "N잡 팜희", image: "/Work.jpg" },
  { name: "리더 팜희", image: "/Leader.jpg" },
  { name: "열공 팜희", image: "/Study.jpg" },
];

export default function EventPage() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const account = useCurrentAccount();
  const handleCardClick = (index: number) => {
    setSelectedCard((prev) => (prev === index ? null : index));
  };
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [_, setError] = useState<string | null>(null);

  const { buyEventProduct } = useBuyProduct();

  const handleClaim = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // const claimLink = await fetch(`${backendUrl}/zk/zk-send/mintPami`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     recipient: account?.address || "",
      //   }),
      // });

      // const claimLinkData = await claimLink.json();
      // console.log(claimLinkData);
      // const link = await ZkSendLink.fromUrl(claimLinkData);
      // const tx = await link.createClaimTransaction(account?.address!);
      // const result = await claimAssets(tx, account?.address!, link.keypair);
      buyEventProduct({ collectionId: "0x1", storeId: "0x2", slotNumber: 1 });
      setResult(true);
    } catch (err: any) {
      console.error(err);
      setError("클레임 처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto h-screen w-full space-y-6 p-4">
      <h1 className="text-center text-2xl font-bold">Welcome to Exclusuive</h1>

      {result ? (
        <div className="flex flex-col items-center space-y-4">
          <h2 className="text-xl font-semibold">축하합니다! 팜희가 발급되었어요!</h2>
          <div className="relative aspect-[3/4] w-full max-w-[400px]">
            <img
              src={selectedCard !== null ? exampleCardContent[selectedCard].image : ""}
              alt={selectedCard !== null ? exampleCardContent[selectedCard].name : ""}
              className="h-full w-full rounded-lg object-cover"
            />
          </div>
          <p className="text-lg font-medium">
            {selectedCard !== null ? exampleCardContent[selectedCard].name : ""} NFT가 지갑에
            추가되었습니다!
          </p>
        </div>
      ) : (
        <>
          <p className="text-center text-lg">제일 마음에 드는 팜희를 골라봐!</p>

          <div className="relative">
            <Carousel className="mx-auto w-full max-w-[400px]">
              <CarouselContent>
                {exampleCardContent.map((card, index) => (
                  <CarouselItem key={index}>
                    <div
                      className={`relative cursor-pointer transition-all duration-200 ${
                        selectedCard === index ? "rounded-lg ring-4 ring-blue-500" : ""
                      }`}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className="relative aspect-[3/4] w-full">
                        <img
                          src={card.image}
                          alt={card.name}
                          className="h-full w-full max-w-[400px] rounded-lg object-cover"
                        />
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="mt-8 flex justify-center">
            {account ? (
              <Button
                onClick={handleClaim}
                className="px-8 py-4 text-lg font-bold"
                disabled={selectedCard === null || isLoading}
              >
                NFT 발급!
              </Button>
            ) : (
              <ConnectButton />
            )}
          </div>
        </>
      )}
    </div>
  );
}
