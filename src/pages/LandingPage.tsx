import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Sparkles, Store } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";

const BouncingText = ({ text }: { text: string }) => {
  const parts = text.split(/(SUI)/i); // Split by SUI, case-insensitive

  return (
    <div className="flex">
      {parts.map((part, index) => {
        const isSui = part.toUpperCase() === "SUI";
        // Calculate the starting index for animation delay based on previous parts' lengths
        const baseDelayIndex = parts.slice(0, index).reduce((acc, p) => acc + p.length, 0);

        return part.split("").map((char, charIndex) => (
          <span
            key={`${index}-${charIndex}`}
            className={`inline-block animate-bounce font-bold ${isSui ? "text-blue-400" : ""}`}
            style={{
              animationDelay: `${(baseDelayIndex + charIndex) * 0.1}s`,
              animationDuration: "1s",
              animationIterationCount: "infinite",
            }}
          >
            {isSui ? char.toUpperCase() : char}
          </span>
        ));
      })}
    </div>
  );
};

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
      {/* Hero */}
      <section>
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 md:flex-row md:px-16">
          <div className="max-w-2xl">
            <h1 className="my-10 text-3xl leading-tight font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
              <BouncingText text="Exclusuive" />
            </h1>

            <h1 className="mb-4 text-3xl leading-tight font-extrabold text-gray-900 md:text-4xl lg:text-5xl">
              Make your own ecosystems without any limitations. <br />
            </h1>
            <p className="mb-8 text-xl font-bold text-gray-800 md:text-2xl">
              Exclusuive is the ultimate customization tool for NFTs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/admin">
                <button className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 sm:px-6 sm:py-3 sm:text-base">
                  Try it out
                </button>
              </Link>
              <Link to="/docs">
                <button className="cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-800 hover:bg-gray-200 sm:px-6 sm:py-3 sm:text-base">
                  See how it works
                </button>
              </Link>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <img
              src="/landing_item.png"
              alt="3D Illustration"
              className="w-full max-w-4xl opacity-0 transition-all duration-700 ease-in-out hover:opacity-100"
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.opacity = "1";
              }}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-100 px-6 py-24 text-black">
        <div className="mx-auto mb-16 max-w-6xl text-center">
          <h2 className="mb-4 text-4xl font-bold">Why Exclusuive?</h2>
          <p className="text-lg text-gray-700">
            Everything you need to empower your NFT community.
          </p>
        </div>
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <Card className="bg-white">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-center gap-x-4">
                <Sparkles className="h-8 w-8 text-gray-800" />
                <h3 className="text-xl font-semibold">No-Code Customization</h3>
              </div>

              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full rounded-lg"
                  src="https://www.youtube.com/embed/xQr-Fv7I02c?si=jgaC7ObO06rEj9l7"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>

              <p className="text-gray-600">
                Visually design and customize every aspect of your NFT collections. Define unique
                traits, manage metadata, and set up revealing mechanics, all through an intuitive
                interface without writing a single line of code.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-white">
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center justify-center gap-x-4">
                <Store className="h-8 w-8 text-gray-800" />
                <h3 className="text-xl font-semibold">Modular Store System</h3>
              </div>
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full rounded-lg"
                  src="https://www.youtube.com/embed/xQr-Fv7I02c?si=jgaC7ObO06rEj9l7"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-gray-600">
                Set up sophisticated sales rules and access controls for your NFTs. Configure
                minting conditions, pricing tiers, and integrate membership policies directly into
                your storefront, leveraging a flexible and powerful system.
              </p>
            </CardContent>
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
        <Link to="/admin">
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
