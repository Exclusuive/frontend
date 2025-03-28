import { useState } from "react";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { Button } from "../ui/button";
import { QRCodeCanvas } from "qrcode.react";
import { Items } from "@/types/types";

interface MintItemNFTProps {
  id: string;
  capId: string;
  items: Items[];
}

const MintItem = ({ id, capId, items }: MintItemNFTProps) => {
  const [recipient, setRecipient] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  const { mintItem } = useSendTransactions();

  const handleMintItem = () => {
    if (!recipient) return;
    mintItem({
      id: id,
      capId: capId,
      baseId: recipient,
      itemType: selectedItem,
    });
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mint Item NFT</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Item Name</label>
        <select
          className="w-full rounded-lg border px-3 py-2 text-sm"
          value={selectedItem}
          onChange={(e) => setSelectedItem(e.target.value)}
        >
          <option value="" disabled>
            -- Select Item --
          </option>
          {items.map((item, index) => (
            <option key={index} value={item.type}>
              {item.type}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col items-center p-4">
        <QRCodeCanvas value="https://myyonseinft.com/preview/123" size={200} />
        <p className="mt-2 text-sm text-gray-500">Base Mint QR code</p>
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
          onClick={handleMintItem}
          disabled={!recipient}
          className="rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Mint NFT
        </Button>
      </div>
    </div>
  );
};

export default MintItem;
