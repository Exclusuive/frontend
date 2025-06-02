import React, { useState } from "react";

const menu = [
  {
    label: "Introduction",
    id: "introduction",
    children: [{ label: "Overview", id: "overview" }],
  },
  {
    label: "Web",
    id: "web",
    children: [
      { label: "How to Embed", id: "embed" },
      { label: "Customize Viewer", id: "customize" },
    ],
  },
  {
    label: "SDK (Typescript)",
    id: "sdk",
    children: [
      { label: "Installation", id: "install" },
      { label: "Functions", id: "functions" },
    ],
  },
  {
    label: "API",
    id: "api",
    children: [
      { label: "Auth", id: "auth" },
      { label: "Minting", id: "mint" },
      { label: "Collections", id: "collections" },
    ],
  },
];

const ApiDocsPage: React.FC = () => {
  const [activeId, setActiveId] = useState("overview");

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <header className="bg-black p-4 text-center text-white shadow">
        <h1 className="text-3xl font-bold">Exclusuive API Docs</h1>
        <p className="text-sm text-gray-300">
          Empowering communities to build NFT experiences — one API at a time
        </p>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {/* Navigation */}
        <nav className="w-full border-b border-gray-200 bg-gray-100 p-4 md:w-64 md:border-r md:border-b-0">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Documentation</h2>
          <ul className="space-y-4">
            {menu.map((section) => (
              <li key={section.id}>
                <p className="font-medium text-gray-700">{section.label}</p>
                <ul className="mt-1 ml-4 space-y-1">
                  {section.children.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        onClick={() => setActiveId(item.id)}
                        className={`block rounded px-2 py-1 text-sm ${
                          activeId === item.id ? "bg-blue-600 text-white" : "hover:bg-blue-100"
                        }`}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </nav>

        {/* Main content */}
        <main className="flex-1 space-y-12 p-6">
          <section id="overview">
            <h2 className="mb-2 text-2xl font-semibold">Overview</h2>
            <p>Welcome to Exclusuive’s documentation. Here’s how to get started...</p>
          </section>

          <section id="embed">
            <h2 className="mb-2 text-2xl font-semibold">How to Embed</h2>
            <p>Instructions for embedding your NFT viewer...</p>
          </section>

          <section id="customize">
            <h2 className="mb-2 text-2xl font-semibold">Customize Viewer</h2>
            <p>Options to customize the look and behavior of the viewer...</p>
          </section>

          <section id="install">
            <h2 className="mb-2 text-2xl font-semibold">Installation</h2>
            <p>Install our SDK with npm or yarn...</p>
          </section>

          <section id="functions">
            <h2 className="mb-2 text-2xl font-semibold">Functions</h2>
            <p>Details of SDK methods you can call...</p>
          </section>

          <section id="auth">
            <h2 className="mb-2 text-2xl font-semibold">Auth</h2>
            <p>Authenticate your users using wallet sign-in...</p>
          </section>

          <section id="mint">
            <h2 className="mb-2 text-2xl font-semibold">Minting</h2>
            <p>Mint your NFT using this endpoint...</p>
          </section>

          <section id="collections">
            <h2 className="mb-2 text-2xl font-semibold">Collections</h2>
            <p>Manage your collections and slots...</p>
          </section>
        </main>
      </div>

      <footer className="mt-auto bg-black p-4 text-center text-white">
        <p>&copy; 2025 Exclusuive. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ApiDocsPage;
