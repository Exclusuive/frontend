import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NFTOptionsProps } from "@/types/types";

const NFTOptions: React.FC<NFTOptionsProps> = ({ setSelectedOption }) => {
  return (
    <div className="bg-white">
      <div className="text-3xl mb-5">Dashboard</div>
      <div className="flex justify-between">
        <div className="text-xl">Create a new collection</div>
        <Link to="/">
          <Button className="flex items-center gap-2 self-start rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
            <ArrowLeft size={20} /> Back
          </Button>
        </Link>
    </div>

    <div className="flex flex-col items-center gap-6 mt-10">

        {/* 새 NFT 만들기 */}
        <Card
          className="bg-[#EFEFEF] flex h-[200px] w-full min-w-[280px] cursor-pointer flex-col justify-between p-4 transition hover:shadow-lg"
          onClick={() => setSelectedOption("create")}
        >
          <CardHeader className="mt-5 text-lg font-semibold">Create new NFTs</CardHeader>
          <CardContent className="mb-5 text-center text-sm text-gray-600">
            Mint new NFTs and apply exclusive policies during creation.
          </CardContent>
        </Card>

        {/* 기존 NFT 정책 적용 */}
        <Card
          className="bg-[#EFEFEF] flex h-[200px] w-full min-w-[280px] cursor-pointer flex-col justify-between p-4 transition hover:shadow-lg"
          onClick={() => setSelectedOption("apply")}
        >
            <CardHeader className="mt-5 text-lg font-semibold">
              Apply Policies to Existing NFTs
            </CardHeader>
          <CardContent className="mb-5 text-center text-sm text-gray-600">
            Already have NFTs? Apply exclusive policies to your existing collection.
          </CardContent>
        </Card>
      </div>
      </div>
  );
};

export default NFTOptions;
