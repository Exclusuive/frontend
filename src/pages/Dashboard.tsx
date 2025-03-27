import CollectionCard from "@/components/CollectionCard";
import { collections } from "@/types/examples";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [viewItem, setViewItem] = useState("All");

  const filteredCollections = collections.filter((collection) => {
    if (viewItem === "All") return collections;
    if (viewItem === "View") return !collection.showManage;
    if (viewItem === "Manage") return collection.showManage;
  });

  return (
    <div className="h-full min-h-screen w-full bg-white">
      {/* collections Section */}
      <div className="text-3xl mb-1 pt-20 ml-5">Dashboard</div>
      <div className="text-2xl ml-10">Collections</div>

      <div className="mx-auto mt-8 grid w-[80%] max-w-screen-xl grid-cols-1 gap-6 md:grid-cols-2">
        {filteredCollections.map((Collection, index) => (
          <CollectionCard bannerUrl={""} key={index} {...Collection} />
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
