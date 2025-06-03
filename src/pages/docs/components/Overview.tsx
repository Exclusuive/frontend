import React from "react";

const Overview: React.FC = () => {
  return (
    <section id="overview">
      <h2 className="mb-2 text-2xl font-semibold">Overview</h2>
      <div className="space-y-6">
        <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white shadow-lg">
          <h3 className="mb-4 text-xl font-bold">Welcome to Exclusuive! 🚀</h3>
          <p className="text-lg leading-relaxed">
            We're thrilled to have you join our journey. Get ready to explore the future of NFT
            collections.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <h4 className="mb-3 text-lg font-semibold text-gray-800">Dashboard</h4>
            <p className="text-gray-600">
              We provide you a powerful dashboard to manage your NFT collections.
              <br />
              You can create, manage, and optimize your NFT collections effortlessly.
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
            <h4 className="mb-3 text-lg font-semibold text-gray-800">SDK</h4>
            <p className="text-gray-600">
              We provide you a powerful SDK to manage your NFT collections.
              <br />
              You can create, manage, and optimize your NFT collections effortlessly.
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-gray-50 p-6">
          <div className="flex items-center space-x-2 text-sm font-bold text-gray-900">
            <span>📚</span>
            <p>Explore our documentation using the menu on the left to get started!</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Overview;
