import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NFTOptionsProps } from "@/types/types";

const NFTOptions: React.FC<NFTOptionsProps> = ({ setSelectedOption }) => {
  return (
    <div className="w-full bg-white flex flex-col gap-6 mt-10 ml-5">
      <div className="text-3xl mb-1">Dashboard</div>

      <div className="ml-10 flex justify-between">
        <div className="text-2xl">Create a new collection</div>
        <Link to="/">
          <Button className="mr-10 flex items-center gap-2 self-start rounded-lg bg-[#5632A1] px-4 py-2 text-white hover:bg-gray-300">
            Back
          </Button>
        </Link>
      </div>

        {/* 새 NFT 만들기 */}
        <div className="ml-10 mr-10">
        <Card
          className="bg-[#EFEFEF] flex h-[200px] w-full min-w-[280px] cursor-pointer flex-col justify-between p-4 transition hover:shadow-lg"
          onClick={() => setSelectedOption("create")}
        >
          <CardHeader className="mt-5 text-lg font-semibold">Create new NFTs</CardHeader>
          <CardContent className="mb-5 text-center text-sm text-gray-600">
            Mint new NFTs and apply exclusive policies during creation.
          </CardContent>
        </Card>
        </div>

        {/* 기존 NFT 정책 적용 */}
        <div className="ml-10 mr-10">
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
