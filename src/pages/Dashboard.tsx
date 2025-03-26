import CollectionCard from "@/components/CollectionCard";
import ProfileCard from "@/components/ProfileCard";
import { useExclusuiveQuery } from "@/hooks/useExclusuiveQuery";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [viewItem, setViewItem] = useState("All");
  const account = useCurrentAccount();
  const { getCollectionInfos } = useExclusuiveQuery();
  const { result } = getCollectionInfos(account?.address || "");
  return (
    <div className="h-full min-h-screen w-full bg-gray-100">
      {/* collections Section */}
      <div className="bg-banner mx-auto h-48 w-full"></div>

      <ProfileCard viewItem={viewItem} setViewItem={setViewItem} />
      <div className="mx-auto mt-8 grid w-full max-w-screen-xl grid-cols-1 gap-6 md:grid-cols-3">
        {result.map((collection, index) => (
          <CollectionCard
            title={collection.name}
            bannerUrl={collection.bannerImg}
            key={index}
            description={collection.description}
          />
        ))}

        {/* Create New Collection Card */}
        {viewItem !== "View" && (
          <Link
            to="/makecollection"
            className="flex items-center justify-center rounded-lg bg-white p-6 shadow-md"
          >
            <div className="text-gray-500">+ Create a New Collection</div>
          </Link>
        )}
      </div>
    </div>
  );
}
