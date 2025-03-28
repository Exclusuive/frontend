import { useState } from "react";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { Button } from "../ui/button";
import { QRCodeCanvas } from "qrcode.react";

interface MintBaseNFTProps {
  id: string;
  capId: string;
}

const MintBase = ({ id, capId }: MintBaseNFTProps) => {
  const [recipient, setRecipient] = useState("");
  const { mintBase } = useSendTransactions();

  const handleMint = () => {
    if (!recipient) return;
    mintBase({
      id: id,
      capId: capId,
      imgUrl: "https://dokpaminft-season2.s3.us-east-1.amazonaws.com/test/character.png",
      toAddress: recipient,
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mint Base NFT</h2>
      <div className="flex flex-col items-center p-4">
        <QRCodeCanvas value="https://myyonseinft.com/preview/123" size={200} />
        <p className="mt-2 text-sm text-gray-500">Item Mint QR code</p>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Recipient Address</label>
        <input
          type="text"
          className="w-full rounded-lg border px-3 py-2 text-sm"
          placeholder="0x..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
      </div>

      <div className="mt-6 text-right">
        <Button
          onClick={handleMint}
          disabled={!recipient}
          className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Mint Base
        </Button>
      </div>
    </div>
  );
};

export default MintBase;
