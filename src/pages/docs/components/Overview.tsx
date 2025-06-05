import React from "react";

const Overview: React.FC = () => {
  return (
    <section id="overview" className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <h2 className="mb-8 text-5xl font-extrabold text-gray-900">Overview</h2>

        <div className="space-y-8">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-xl">
            <h3 className="mb-4 text-4xl font-extrabold">Welcome to Exclusuive! 🚀</h3>
            <p className="text-2xl leading-relaxed font-bold">
              We're thrilled to have you join our journey. Get ready to explore the future of NFT
              collections.
            </p>
          </div>

          <div className="space-y-16 p-8">
            {/* Slide 1 */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Problems</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/nft_problem.png" alt="Engagement Paradox" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  When NFT projects gain early value, they often attract speculators. But engagement
                  drops and communities weaken.
                </p>
                <p>
                  ExcluSUIve solves this by turning contribution and participation into evolving
                  assets — keeping users actively engaged.
                </p>
              </div>
            </section>

            {/* Slide 2 */}
            <section className="space-y-6">
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img
                  src="/docs/game_problem.png"
                  alt="Game Development Problem"
                  className="w-full"
                />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Game developers often give up on NFT projects because of all the extra systems
                  they have to build — like inventories and stores.
                </p>
                <p>
                  ExcluSUIve handles those parts for them, letting creators focus entirely on the
                  gameplay.
                </p>
              </div>
            </section>

            {/* Slide 3 */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">
                Solution 1: Hierarchical NFTs
              </h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img
                  src="/docs/nft_structure.png"
                  alt="Hierarchical NFT Structure"
                  className="w-full"
                />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Our system introduces a layered NFT model: a Base Object with attachable Item
                  Objects.
                </p>
                <p>
                  Each item can also include Properties and Configs — similar to layers in design
                  tools like Illustrator.
                </p>
              </div>
            </section>

            {/* Slide 4 */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">
                Solution 2: NFT Store System
              </h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/store_system.png" alt="Store System" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>
                  Based on Sui's Kiosk model, our store system lets managers create customizable
                  slots with items, prices, and access conditions.
                </p>
                <p>
                  Tickets can restrict access, enabling flexible community or event-based sales.
                </p>
              </div>
            </section>

            {/* Slide 5 */}
            <section className="space-y-6">
              <h2 className="text-4xl font-extrabold text-blue-700">Milestone</h2>
              <div className="overflow-hidden rounded-xl shadow-2xl">
                <img src="/docs/milestone.png" alt="Milestone Roadmap" className="w-full" />
              </div>
              <div className="space-y-4 text-xl font-bold text-gray-700">
                <p>Step 1: Users can already try Inventory and Store features on our site.</p>
                <p>
                  Step 2: We'll release a library for easy integration. Step 3: We'll expand into a
                  SaaS platform with sponsored transactions.
                </p>
              </div>
            </section>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
              <h4 className="mb-4 text-3xl font-extrabold text-gray-800">Dashboard</h4>
              <p className="text-xl font-bold text-gray-600">
                We provide you a powerful dashboard to create, manage, and optimize your NFT
                collections
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg">
              <h4 className="mb-4 text-3xl font-extrabold text-gray-800">SDK</h4>
              <p className="text-xl font-bold text-gray-600">
                We provide you a powerful SDK to create, manage, and optimize your NFT collections
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 p-8">
            <div className="flex items-center space-x-4 text-xl font-bold text-gray-900">
              <span className="text-3xl">📚</span>
              <p>Explore our documentation using the menu on the left to get started!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
