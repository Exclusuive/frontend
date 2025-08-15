import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Link, useSearchParams } from "react-router-dom";
import { CirclePlay } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
// import SetRolePopup from "@/components/SetRolePopup";
import EventPopup from "@/components/EventPopup";
// import { Dialog, DialogTrigger } from "@/components/ui/dialog";
// import { useCurrentAccount, useWallets } from "@mysten/dapp-kit";
// import { useConnectWallet } from "@mysten/dapp-kit";
// import { useAuthStore } from "@/stores/useAuthStore";
// import { Role } from "@/types/user";

export default function LandingPage() {
  // const wallets = useWallets();
  // const { mutate: connect } = useConnectWallet();
  // const account = useCurrentAccount();
  // const { login } = useAuthStore();
  // const navigate = useNavigate();
  // const [isOpen, setIsOpen] = useState(false);
  const [isEventPopupOpen, setIsEventPopupOpen] = useState(false);
  const [searchParams] = useSearchParams();

  const showPopup = searchParams.get("showpopup");

  // 페이지 로드 시 OceanDao 이벤트 팝업 자동 표시
  useEffect(() => {
    if (!showPopup) {
      setTimeout(() => {
        setIsEventPopupOpen(true);
      }, 1000); // 1초 후 팝업 표시
    }
  }, []);

  // const handleOpenChange = (newOpen: boolean) => {
  //   setIsOpen(newOpen);
  // };

  // const handleLogin = (selectedRole: Role) => {
  //   if (!selectedRole) return;
  //   if (account) {
  //     login(account.address, selectedRole.id);
  //     navigate("/setCollection");
  //   } else {
  //     const wallet = wallets.find((w) => w.name.includes("Slush"))
  //       ? wallets.find((w) => w.name.includes("Slush"))
  //       : wallets[0];

  //     if (wallet) {
  //       connect(
  //         { wallet },
  //         {
  //           onSuccess: (wallet: any) => {
  //             if (wallet.accounts[0].address) {
  //               login(wallet.accounts[0].address, selectedRole.id);
  //               navigate("/setCollection");
  //             }
  //           },
  //           onError: () => {
  //             window.alert("Failed to connect wallet");
  //           },
  //         },
  //       );
  //     }
  //   }
  // };

  const handleCloseEventPopup = () => {
    setIsEventPopupOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full min-w-[320px] flex-col bg-gradient-to-b from-[#EDF6FF] to-[#F8F8FF] bg-no-repeat">
      <section className="flex h-screen flex-col justify-center px-4 font-[montserrat] md:px-20">
        <div className="text-[#474747]">
          <h1 className="text-[22px] font-bold sm:text-[40px] lg:text-[60px] xl:text-[75px]">
            Create your <span className="font-extrabold text-[#4CA3FF]">Dynamic NFT</span> <br />
            No code, no hassle.
          </h1>
          <p className="font-regular my-6 font-[16px] text-[#636363] sm:text-[18px] md:text-[20px] lg:text-[22px]">
            A robust, modular system engineered for scalable deployment{" "}
            <br className="hidden sm:block" /> and real-world NFT use cases that drive lasting value
          </p>
          <div className="my-8 flex flex-col gap-y-6 sm:flex-row sm:gap-x-16">
            {/* <Dialog open={isOpen} onOpenChange={handleOpenChange}>
              <DialogTrigger asChild>
                <Button className="h-full w-fit bg-gradient-to-r from-[#5656F2] to-[#4CA3FF] leading-[normal] font-bold transition-transform duration-200 ease-in-out hover:scale-105 focus:scale-105 active:scale-100">
                  <div className="flex items-center px-10 py-2 text-xl">
                    <span className="pr-2">Try it out</span>
                    <ArrowRightIcon className="h-4 w-4 font-bold" />
                  </div>
                </Button>
              </DialogTrigger>
              <SetRolePopup onOpenChange={handleOpenChange} onConfirm={handleLogin} />
            </Dialog> */}
            <Link to="/blockthon">
              <Button className="h-full w-fit bg-gradient-to-r from-[#5656F2] to-[#4CA3FF] leading-[normal] font-bold transition-transform duration-200 ease-in-out hover:scale-105 focus:scale-105 active:scale-100">
                <div className="flex items-center px-10 py-2 text-xl">
                  <span className="pr-2">Try it out</span>
                  <ArrowRightIcon className="h-4 w-4 font-bold" />
                </div>
              </Button>
            </Link>

            <Link
              to="https://www.youtube.com/live/W0eBDO3raEI?si=AvaVP5f-v4ViY9wm&t=5600"
              className="flex flex-col justify-center text-xl"
              target="_blank"
            >
              <div className="flex gap-2 text-[#4CA3FF] transition-transform duration-200 ease-in-out hover:scale-105">
                <CirclePlay className="h-8 w-8 rounded-2xl shadow-[0px_15px_20px_#4ca3ff33]" />
                <span className="font-bold">See how it works</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center px-4 py-16 md:px-16">
        <div className="text-center text-[#474747]">
          <h1 className="font-Exclusuive text-[40px] font-bold tracking-wider md:text-[100px]">
            Exclu
            <span className="inline-block -translate-y-2 font-extrabold text-[#4DA2FF] md:-translate-y-5">
              Sui
            </span>
            ve
          </h1>
          <p className="font-regular font-[pretendard] text-[20px] text-[#212124] md:text-[40px]">
            The easiest NFT creation{" "}
            <span className="font-semibold text-[#237DDB]">no coding skills</span> required
          </p>
        </div>
        <div className="my-12 grid w-full max-w-[1200px] grid-cols-1 gap-6 font-[pretendard] md:grid-cols-3">
          <Card className="flex flex-col justify-between bg-white py-0 shadow-[0px_10px_20px_#0000001a]">
            <CardContent className="flex flex-1 flex-col p-10">
              <div className="text-[40px] leading-tight font-bold text-[#32383D] md:text-[40px]">
                Standard for Dynamic NFT
              </div>
              <div className="mt-4 text-[18px] text-[#676F76]">
                <div className="flex-1">
                  We're providing a new NFT standard that{" "}
                  <span className="font-bold text-[#4CA3FF]">
                    makes it easier to create dynamic NFTs.{" "}
                  </span>
                  With this standard, building inventories and item markets becomes simple and
                  consistent.
                </div>
              </div>
              <div className="mt-10 flex flex-1 items-end justify-end">
                <img src="/landing/standard.png" alt="Standard for Dynamic NFT" />
              </div>
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-between bg-white py-0 shadow-[0px_10px_20px_#0000001a]">
            <CardContent className="flex flex-1 flex-col p-10">
              <div className="text-[40px] leading-tight font-bold text-[#32383D]">
                Shared Library <br className="hidden lg:block" /> & Protocols
              </div>
              <div className="mt-4 text-[18px] text-[#676F76]">
                We offer a shared library based on our standard,{" "}
                <span className="font-bold text-[#4CA3FF]">so everyone builds </span> in the same
                way. This improves sync and{" "}
                <span className="font-bold text-[#4CA3FF]">makes it easier to connect</span> across
                platforms.
              </div>
              <div className="mt-10 flex flex-1 items-end justify-end">
                <img src="/landing/library.png" alt="Shared Library & Protocols" />
              </div>
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-between bg-white py-0 shadow-[0px_10px_20px_#0000001a]">
            <CardContent className="flex flex-1 flex-col p-10">
              <div className="text-[40px] leading-tight font-bold text-[#32383D]">
                No-code <br className="hidden lg:block" /> customization
              </div>
              <div className="mt-4 text-[18px] text-[#676F76]">
                We provide a no-code service that lets non-developers create and manage NFTs using
                our standard. Through a dashboard, you can{" "}
                <span className="font-bold text-[#4CA3FF]"> manage your collection</span> and
                customize dynamic features{" "}
                <span className="font-bold text-[#4CA3FF]">without writing any code.</span>
              </div>
              <div className="mt-10 flex items-end justify-end">
                <img src="/landing/nocode.png" alt="No-code customization" />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* OceanDao 이벤트 팝업 */}
      <EventPopup isOpen={isEventPopupOpen} onClose={handleCloseEventPopup} />
    </div>
  );
}
