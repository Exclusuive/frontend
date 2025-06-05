import React from "react";

const UserDashboard: React.FC = () => {
  return (
    <section id="UserDashboard" className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-8">
          <div className="space-y-16 p-8">
            {/* Introduction */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Getting Started</h2>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  This section introduces how users can explore, customize, and interact with their
                  NFTs.
                </p>
              </div>
            </section>

            {/* Login Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Login</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/member_login.png" alt="Member Login" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Users can connect their wallet and access the dashboard through the Member tab.
                </p>
              </div>
            </section>

            {/* Select Collection Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Select Collection</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img
                  src="/docs/myNFT_1_select_collection.png"
                  alt="Select Collection"
                  className="w-full"
                />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  After logging in, users select a collection to manage or customize their NFTs.
                </p>
              </div>
            </section>

            {/* Select Base NFT Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Select Base NFT</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/myNFT_2_select_Base.png" alt="Select Base NFT" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Users choose a Base NFT from their wallet to begin customizing it with different
                  items.
                </p>
              </div>
            </section>

            {/* Base Overview Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Base Overview</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/baseOverview.png" alt="Base Overview" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Each Base NFT can be equipped with various layered items to give it a unique
                  appearance.
                </p>
              </div>
            </section>

            {/* Item Equipped Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Item Equipped</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/item_equpped.png" alt="Item Equipped" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Items from the user's wallet can be equipped to the base object, changing the
                  NFT's visual style in real-time.
                </p>
              </div>
            </section>

            {/* Explore Collections Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Explore Collections</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img
                  src="/docs/explore_collections.png"
                  alt="Explore Collections"
                  className="w-full"
                />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Users can browse public collections to see what other communities are offering.
                </p>
              </div>
            </section>

            {/* Showcase NFT Section */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Dokpami NFT</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/showcaseNFT.png" alt="Get Showcase NFT" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>Users can mint a random Showcase NFT and receive a real-world benefit.</p>
              </div>
            </section>

            {/* Dokpami NFT Section */}
            <section className="space-y-6">
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/dokpamiNFT.png" alt="Dokpami NFT" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  This is one example of a Dokpami NFT with Yonsei branding, minted and customized
                  by the user.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;
