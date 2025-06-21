import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { CirclePlay } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen w-full min-w-[320px] flex-col">
      <section className="flex h-screen flex-col justify-center bg-gradient-to-b from-[#EDF6FF] via-[#F8F8FF] to-[#EDF6FF] bg-no-repeat px-4 font-[montserrat] md:px-16">
        <div className="text-[#474747]">
          <h1 className="text-[75px] font-bold">
            Create your <span className="font-extrabold text-[#4CA3FF]">Dynamic NFT</span> <br />
            No code, no hassle.
          </h1>
          <p className="font-regular my-6 text-[22px] text-[#636363]">
            A robust, modular system engineered for scalable deployment and real-world NFT use cases
            that drive lasting value
          </p>
          <div className="my-8 flex flex-col gap-x-16 sm:flex-row">
            <Link to="/introduction">
              <Button className="h-full bg-gradient-to-r from-[#5656F2] to-[#4CA3FF] leading-[normal] font-bold">
                <div className="flex items-center px-10 py-2 text-xl">
                  <span className="pr-2">Try it out</span>
                  <ArrowRightIcon className="h-4 w-4 font-bold" />
                </div>
              </Button>
            </Link>
            <Link to="/docs" className="flex items-center justify-center gap-2 text-xl">
              <div className="flex items-center justify-center gap-2 text-[#4CA3FF]">
                <CirclePlay className="h-8 w-8 rounded-2xl shadow-[0px_15px_20px_#4ca3ff33]" />
                <span className="font-bold">See how it works</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center bg-gradient-to-b from-[#EDF6FF] via-[#F8F8FF] to-[#EDF6FF] bg-no-repeat px-4 py-16 md:px-16">
        <div className="text-center text-[#474747]">
          <h1 className="font-[logo] text-[110px] font-bold">
            Exclu
            <span className="inline-block -translate-y-5 font-extrabold text-[#4DA2FF]">Sui</span>ve
          </h1>
          <p className="font-regular font-[pretendard] text-[40px] text-[#212124]">
            The easiest NFT creation{" "}
            <span className="font-semibold text-[#237DDB]">no coding skills</span> required
          </p>
        </div>
        <div className="my-12 grid w-full max-w-[1200px] grid-cols-1 gap-6 font-[pretendard] md:grid-cols-3">
          <Card className="flex flex-col justify-between bg-white shadow-[0px_10px_20px_#0000001a]">
            <CardHeader>
              <CardTitle className="text-[40px] leading-tight font-bold">
                Standard for Dynamic NFT
              </CardTitle>
            </CardHeader>
            <CardDescription className="px-6 text-[18px] text-[#676F76]">
              <div className="flex-1">
                We're providing a new NFT standard that{" "}
                <span className="font-bold text-[#4CA3FF]">
                  makes it easier to create dynamic NFTs.{" "}
                </span>
                With this standard, building inventories and item markets becomes simple and
                consistent.
              </div>
            </CardDescription>
            <div className="my-8 flex items-end justify-end gap-2 px-6">
              <img src="/landing/standard.png" alt="Standard for Dynamic NFT" />
            </div>
          </Card>
          <Card className="flex flex-col justify-between bg-white shadow-[0px_10px_20px_#0000001a]">
            <CardHeader>
              <CardTitle className="text-[40px] leading-tight font-bold">
                Shared Library <br className="hidden lg:block" /> & Protocols
              </CardTitle>
            </CardHeader>
            <CardDescription className="px-6 text-[18px] text-[#676F76]">
              We offer a shared library based on our standard,{" "}
              <span className="font-bold text-[#4CA3FF]">so everyone builds </span> in the same way.
              This improves sync and{" "}
              <span className="font-bold text-[#4CA3FF]">makes it easier to connect</span> across
              platforms.
            </CardDescription>
            <div className="my-8 flex items-end justify-end gap-2 px-6">
              <img src="/landing/library.png" alt="Shared Library & Protocols" />
            </div>
          </Card>
          <Card className="flex flex-col justify-between bg-white shadow-[0px_10px_20px_#0000001a]">
            <CardHeader>
              <CardTitle className="text-[40px] leading-tight font-bold">
                No-code <br className="hidden lg:block" /> cusomization
              </CardTitle>
            </CardHeader>
            <CardDescription className="px-6 text-[18px] text-[#676F76]">
              We provide a no-code service that lets non-developers create and manage NFTs using our
              standard. Through a dashboard, you can{" "}
              <span className="font-bold text-[#4CA3FF]"> manage your collection</span> and
              customize dynamic features{" "}
              <span className="font-bold text-[#4CA3FF]">without writing any code.</span>
            </CardDescription>
            <div className="my-8 flex items-end justify-end gap-2 px-6">
              <img src="/landing/nocode.png" alt="No-code customization" />
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
