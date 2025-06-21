import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { ArrowRightIcon, CirclePlay } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";

// Re-added CarouselImage array
const CarouselImage = [
  "/Home.jpg",
  "/Friend.jpg",
  "/Leader.jpg",
  "/Life.jpg",
  "/Love.jpg",
  "/Study.jpg",
  "/Work.jpg",
  "/Yolo.jpg",
];

export default function LandingPage() {
  return (
    <div className="w-full bg-white text-black">
      <section className="flex h-screen flex-col justify-center bg-gradient-to-b from-[#EDF6FF] via-[#F8F8FF] to-[#EDF6FF] bg-no-repeat px-4 font-[montserrat] md:px-16">
        <div className="text-[#474747]">
          <h1 className="text-[40px] font-bold md:text-[75px]">
            Create your <span className="font-extrabold text-[#4CA3FF]">Dynamic NFT</span> <br />
            No code, no hassle.
          </h1>
          <p className="font-regular my-6 text-[22px] text-[#636363]">
            A robust, modular system engineered for scalable deployment and real-world NFT use cases
            that drive lasting value
          </p>
          <div className="md:gap-y-none my-8 flex flex-col gap-y-6 md:flex-row md:gap-x-16">
            <Link to="/introduction">
              <Button className="h-full bg-gradient-to-r from-[#5656F2] to-[#4CA3FF] leading-[normal] font-bold">
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
              <div className="flex gap-2 text-[#4CA3FF]">
                <CirclePlay className="h-8 w-8 rounded-2xl shadow-[0px_15px_20px_#4ca3ff33]" />
                <span className="font-bold">See how it works</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center bg-gradient-to-b from-[#EDF6FF] via-[#F8F8FF] to-[#EDF6FF] bg-no-repeat px-4 py-16 md:px-16">
        <div className="text-center text-[#474747]">
          <h1 className="font-[logo] text-[40px] font-bold md:text-[110px]">
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

      {/* Call to Action */}
      <section className="bg-gray-800 px-6 py-24 text-center text-white">
        <h2 className="mb-6 text-4xl font-bold">Start Building Your NFT World</h2>

        {/* Added Carousel here */}
        <div className="mx-auto mb-8 max-w-3xl">
          <Carousel
            plugins={[
              Autoplay({
                delay: 2000,
              }),
            ]}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {CarouselImage.map((src, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="overflow-hidden rounded-lg">
                      <div className="flex aspect-[3/4] items-center justify-center p-0">
                        <img
                          src={src}
                          alt={`Carousel image ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>

        <p className="mb-8 text-lg text-gray-300">
          Join 1,000+ users customizing NFTs with Exclusuive today.
        </p>
        <Link to="/introduction">
          <Button size="lg" className="bg-black px-8 py-6 text-lg text-white hover:bg-gray-900">
            Launch App
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t bg-gray-50 px-6 py-12 text-center text-sm text-gray-600">
        © 2025 Exclusuive. Built with BlockBlock at Yonsei University.
      </footer>
    </div>
  );
}
