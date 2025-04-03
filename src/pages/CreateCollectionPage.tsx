import NewCollection from "@/components/MakeCollection/NewCollection";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Card({ text, setSelectedOption, goto }: any) {
  return (
    <div
      className="flex h-70 w-70 items-center justify-center rounded-lg border border-black bg-white p-4"
      onClick={() => setSelectedOption(goto)}
    >
      {text}
    </div>
  );
}

export default function CreateCollection() {
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState<"create" | "apply" | null>(null);

  return (
    <div className="pt-5 pr-18 pl-18">
      <div className="pb-2 text-4xl">Dashboard</div>
      <div className="flex w-full items-center justify-between">
        <div className="text-xl">Create a new collection</div>
        <button
          onClick={() => navigate("/")}
          className="cursor-pointer rounded-lg bg-blue-500 px-4 py-2 text-white transition hover:bg-blue-600"
        >
          Back
        </button>
      </div>
      <div className="flex min-h-screen items-center justify-center p-6">
        {selectedOption === null && (
          <div className="flex justify-center gap-10 pt-20">
            <Card
              text="I want to make new NFTs including exclusive policy."
              setSelectedOption={setSelectedOption}
              goto="create"
            />
            <Card
              text="I already made NFTs. Want to apply exclusive policy."
              setSelectedOption={setSelectedOption}
              goto="apply"
            />
          </div>
        )}
        {selectedOption === "create" && <NewCollection />}
        {selectedOption === "apply" && <p>Apply NFT Policy (추가 구현 필요)</p>}
      </div>
    </div>
  );
}
