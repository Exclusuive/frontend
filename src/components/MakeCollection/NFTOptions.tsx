import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { NFTOptionsProps } from "@/types/types";

const NFTOptions: React.FC<NFTOptionsProps> = ({ setSelectedOption }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* 뒤로 가기 버튼 */}
      <Link to="/">
        <Button className="flex items-center gap-2 self-start rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
          <ArrowLeft size={20} /> Back
        </Button>
      </Link>

      <div className="flex justify-center gap-6">
        {/* 새 NFT 만들기 */}
        <Card
          className="flex h-[250px] w-1/4 min-w-[280px] cursor-pointer flex-col justify-between p-4 transition hover:shadow-lg"
          onClick={() => setSelectedOption("create")}
        >
          <CardHeader className="flex flex-col items-center text-center">
            <PlusCircle size={48} className="text-blue-500" />
            <CardTitle className="mt-2 text-lg font-semibold">Create New NFTs</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-gray-600">
            Mint new NFTs and apply exclusive policies during creation.
          </CardContent>
        </Card>

        {/* 기존 NFT 정책 적용 */}
        <Card
          className="flex h-[250px] w-1/4 min-w-[280px] cursor-pointer flex-col justify-between p-4 transition hover:shadow-lg"
          onClick={() => setSelectedOption("apply")}
        >
          <CardHeader className="flex flex-col items-center text-center">
            <CheckCircle size={48} className="text-green-500" />
            <CardTitle className="mt-2 text-lg font-semibold">
              Apply Policies to Existing NFTs
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-gray-600">
            Already have NFTs? Apply exclusive policies to your existing collection.
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NFTOptions;
