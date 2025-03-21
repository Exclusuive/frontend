import MakeCollection from "@/components/MakeCollection/MakeCollection";
import NFTOptions from "@/components/MakeCollection/NFTOptions";
import { useState } from "react";

export default function MakeCollectionPage() {
  const [selectedOption, setSelectedOption] = useState<"create" | "apply" | null>(null);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      {selectedOption === null && <NFTOptions setSelectedOption={setSelectedOption} />}
      {selectedOption === "create" && <MakeCollection goBack={() => setSelectedOption(null)} />}
      {selectedOption === "apply" && <p>Apply NFT Policy (추가 구현 필요)</p>}
    </div>
  );
}
