import React from "react";

const Install: React.FC = () => {
  return (
    <section id="install">
      <h2 className="mb-2 text-2xl font-semibold">Installation</h2>
      <div className="space-y-4">
        <p className="text-lg leading-relaxed text-gray-700">
          Welcome to Exclusuive's documentation! 🚀 We're excited to have you here. Let's get you
          started on your journey with our powerful SDK.
        </p>

        <div className="rounded-lg bg-gray-50 p-4">
          <p className="mb-2 font-medium text-gray-800">Quick Start:</p>
          <ol className="ml-4 list-decimal space-y-2 text-gray-700">
            <li>Install our SDK using npm</li>
            <li>Import it into your project</li>
            <li>Start building amazing NFT experiences!</li>
          </ol>
        </div>

        <div className="rounded-lg bg-gray-900 p-4">
          <code className="block font-mono text-sm text-gray-100">npm install @exclusuive/sdk</code>
        </div>
      </div>
    </section>
  );
};

export default Install;
