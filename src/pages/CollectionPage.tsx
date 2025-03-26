import { useEffect, useState } from "react";
import CollectionCard from "@/components/CollectionCard";
import { getAllCollections } from "@/api/collections";
import { Collection } from "@/types/api"; // 컬렉션 타입 정의

export default function CollectionPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const res = await getAllCollections();
        setCollections(res);
      } catch (err) {
        console.error("컬렉션 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (loading) {
    return <div className="pt-32 text-center">Loading Collections...</div>;
  }

  console.log(collections);

  return (
    <div className="mx-auto grid w-full max-w-screen-xl grid-cols-1 gap-6 pt-32 md:grid-cols-3">
      {collections.map((collection, index) => (
        <CollectionCard
          key={collection.id || index}
          bannerUrl={collection.bannerimg || ""}
          title={collection.name}
          description={collection.description || ""}
        />
      ))}

      {/* <Link
        to="/makecollection"
        className="flex items-center justify-center rounded-lg bg-white p-6 shadow-md hover:bg-gray-100"
      >
        <div className="text-lg text-gray-500">+ Create a New Collection</div>
      </Link> */}
    </div>
  );
}
