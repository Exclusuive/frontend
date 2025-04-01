import { useState } from "react";
import { useSendTransactions } from "@/hooks/useSendTransactions";
import { Button } from "../ui/button";
import { useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

export default function MintItem({ data }: any) {
  const [selectedLayer, setSelectedLayer] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  const [recipient, setRecipient] = useState("");
  const { mintItem } = useSendTransactions();
  const params = useParams();

  const handleMint = () => {
    if (!recipient || !params.collectionId || !params.capId) return;
    mintItem({
      id: params.collectionId,
      capId: params.capId,
      baseId: recipient,
      itemType: selectedItem,
    });
  };

  return (
    <div className="flex h-full w-full flex-col justify-between rounded-lg bg-white p-6 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Mint Item NFT</h2>
      <div>
        <div className="flex flex-col items-center p-4">
          <QRCodeCanvas value="https://myyonseinft.com/preview/123sfd" size={200} />
          <p className="mt-2 text-sm text-gray-500">Mint Base User QR code</p>
        </div>
      </div>

      <div className="mx-auto w-1/2 py-10">
        <div className="mb-4">
          <select
            value={selectedLayer}
            onChange={(e) => setSelectedLayer(e.target.value)}
            className="mb-4 w-full rounded border p-2"
          >
            <option value="">-- Choose Layer --</option>
            {data?.layers?.map((layer: any, index: number) => (
              <option key={index} value={layer.type}>
                {layer.type}
              </option>
            ))}
          </select>
          {selectedLayer && data.items[selectedLayer] && (
            <div className="mb-4">
              <label className="mb-2 block font-semibold text-gray-700">Select Item</label>
              <select
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                className="w-full rounded border p-2"
              >
                <option value="">-- Choose an Item --</option>
                {data.items[selectedLayer].map((item: any, idx: number) => (
                  <option key={idx} value={item.type}>
                    {item.type}
                  </option>
                ))}
              </select>
            </div>
          )}
          <label className="block text-start text-sm font-medium text-gray-700">
            Recipient Address
          </label>
          <input
            type="text"
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
        </div>

        <Button
          onClick={handleMint}
          disabled={!recipient}
          className="w-full rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          Mint Base
        </Button>
      </div>
    </div>
  );
}
