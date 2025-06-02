import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Sparkles, Store } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";

const BouncingText = ({ text }: { text: string }) => {
  const parts = text.split(/(SUI)/i); // Split by SUI, case-insensitive

  return (
    <div className="flex justify-center">
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
      <section className="flex min-h-screen flex-col items-center justify-center bg-gray-900 px-6 py-24 text-center text-white">
        <h1 className="mb-6 max-w-3xl text-5xl font-extrabold">
          <BouncingText text="Exclusuive" />
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-gray-300">
          Everything you need to launch, manage, and scale your NFT ecosystem <br />
          all in one modular, no-code platform.
        </p>
        <div className="flex gap-4">
          <Link to="/admin">
            <Button size="lg" className="bg-blue-400 text-white hover:bg-blue-600">
              Get Started
            </Button>
          </Link>
          <Link to="/docs">
            <Button
              size="lg"
              variant="outline"
              className="border-gray-400 bg-white text-black hover:bg-gray-400 hover:text-white"
            >
              API Docs
            </Button>
          </Link>
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
