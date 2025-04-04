import CollectionInfo from "@/components/CollectionDetail/CollectionInfo";
import { useExclusuiveQuery } from "@/hooks/useExclusuiveQuery";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import EditCollection from "@/components/CollectionDetail/EditCollection";
import EditLayer from "@/components/CollectionDetail/EditLayer";
import { Items, Layer } from "@/types/types";
import AddItem from "@/components/CollectionDetail/AddItem";
import MintBase from "@/components/CollectionDetail/MintBase";
import MintItem from "@/components/CollectionDetail/MintItem";
import Rules from "@/components/CollectionDetail/Rules";

export default function CollectionDetail() {
  const params = useParams();
  const { getCollectionDetail } = useExclusuiveQuery();
  const { result, loading } = getCollectionDetail(params.id || "");
  const [selectedOption, setSelectedOption] = useState<
    "collection" | "layer" | "addItem" | "mintBase" | "mintItem" | "rules"
  >("collection");
  const [layers, setLayers] = useState<Layer[]>([]); // 초기값은 빈 배열로
  const [items, setItems] = useState<Items[]>([]); // 초기값은 빈 배열로

  useEffect(() => {
    if (result) {
      setLayers(result.layers); // result가 바뀔 때 초기 레이어 세팅\
      setItems(result.items);
    }
  }, [result]);

  console.log(result);

  return (
    <main className="flex min-h-screen flex-col p-4">
      <div className="flex flex-1 items-center justify-center">
        {loading ? (
          <div className="animate-pulse text-lg text-gray-500">Loading...</div>
        ) : result ? (
          <div className="flex w-full max-w-7xl items-center justify-center gap-6 bg-gray-100">
            <div className="w-1/2 p-6">
              <CollectionInfo data={result} setSelectedOption={setSelectedOption} />
            </div>
            <div className="w-1/2 p-6">
              {selectedOption === "collection" && <EditCollection />}
              {selectedOption === "layer" && <EditLayer layers={layers} setLayers={setLayers} />}
              {selectedOption === "addItem" && (
                <AddItem layers={layers} id={params.id} capId={params.capId} />
              )}
              {selectedOption === "mintBase" && <MintBase id={params.id!} capId={params.capId!} />}
              {selectedOption === "mintItem" && (
                <MintItem items={items} id={params.id!} capId={params.capId!} />
              )}
              {selectedOption === "rules" && (
                <Rules layers={layers} id={params.id} capId={params.capId} />
              )}
            </div>
          </div>
        ) : (
          <div className="text-red-500">Collection not found.</div>
        )}
      </div>
    </main>
  );
}
