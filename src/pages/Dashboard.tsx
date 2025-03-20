import CollectionCard from "@/components/CollectionCard";
import ProfileCard from "@/components/ProfileCard";
import { collections } from "@/types/examples";
import { useState } from "react";

export default function Dashboard() {
  const [viewItem, setViewItem] = useState("All");

  const filteredCollections = collections.filter((collection) => {
    if (viewItem === "All") return collections;
    if (viewItem === "View") return !collection.showManage;
    if (viewItem === "Manage") return collection.showManage;
  });

  return (
    <div className="h-full min-h-screen w-full bg-gray-100">
      {/* collections Section */}
      <div className="bg-banner mx-auto h-48 w-full"></div>
      <ProfileCard viewItem={viewItem} setViewItem={setViewItem} />
      <div className="mx-auto mt-8 grid w-full max-w-screen-xl grid-cols-1 gap-6 md:grid-cols-3">
        {filteredCollections.map((Collection, index) => (
          <CollectionCard key={index} {...Collection} />
        ))}

        {/* Create New Collection Card */}
        {viewItem !== "View" && (
          <div className="flex items-center justify-center rounded-lg bg-white p-6 shadow-md">
            <button className="text-gray-500">+ Create a New Collection</button>
          </div>
        )}
      </div>
    </div>
  );
}
