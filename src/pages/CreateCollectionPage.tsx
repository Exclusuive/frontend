import { useNavigate } from "react-router-dom";

function Card({text}: {text: string}) {
  return (
    <div className="bg-white border border-black p-4 rounded-lg w-70 h-70 flex items-center justify-center">
      {text}
    </div>
  );
}

export default function CreateCollection() {
  const navigate = useNavigate();

  return (
    <div className="pt-5 pl-18 pr-18">
      <div className="text-4xl pb-2">Dashboard</div>
      <div className="flex justify-between w-full items-center">
        <div className="text-xl">Create a new collection</div>
        <button
          onClick={() => navigate("/managecollection")}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">
          Back
        </button>
      </div>

      <div className="flex gap-10 pt-20 justify-center">
        <Card text="I want to make new NFTs including exclusive policy."/>
        <Card text="I already made NFTs. Want to apply exclusive policy."/>
      </div>
    </div>
  );
}
