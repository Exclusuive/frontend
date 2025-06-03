import React, { useState } from "react";
import { Link } from "react-router-dom";

// Import section components
import Overview from "./components/Overview";
import Install from "./components/Install";
import Functions from "./components/Functions";
import Auth from "./components/Auth";
import Mint from "./components/Mint";
import AdminDashboard from "./components/AdminDashboard";
import UserDashboard from "./components/UserDashboard";

const menu = [
  {
    label: "Introduction",
    id: "introduction",
    children: [{ label: "Overview", id: "overview", component: Overview }],
  },
  {
    label: "Web",
    id: "web",
    children: [
      { label: "Admin Dashboard", id: "adminDashboard", component: AdminDashboard },
      { label: "User Dashboard", id: "userDashboard", component: UserDashboard },
    ],
  },
  {
    label: "SDK (Typescript)",
    id: "sdk",
    children: [
      { label: "Installation", id: "install", component: Install },
      { label: "Functions", id: "functions", component: Functions },
    ],
  },
  // {
  //   label: "API",
  //   id: "api",
  //   children: [
  //     { label: "Auth", id: "auth", component: Auth },
  //     { label: "Minting", id: "mint", component: Mint },
  //   ],
  // },
];

const sectionComponents: { [key: string]: React.FC } = {
  overview: Overview,
  adminDashboard: AdminDashboard,
  userDashboard: UserDashboard,
  install: Install,
  functions: Functions,
  auth: Auth,
  mint: Mint,
};

const ApiDocsPage: React.FC = () => {
  const [activeId, setActiveId] = useState("overview");

  const ActiveComponent = sectionComponents[activeId];

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <header className="bg-black p-4 text-center text-white shadow">
        <Link to="/">
          <h1 className="text-3xl font-bold">Exclusuive Documentation</h1>
          <p className="text-sm text-gray-300">
            Empowering communities to build NFT experiences — one API at a time
          </p>
        </Link>
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
                        onClick={(e) => {
                          e.preventDefault(); // Prevent default anchor behavior
                          setActiveId(item.id);
                        }}
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
          {ActiveComponent ? <ActiveComponent /> : <p>Select a section</p>}
        </main>
      </div>

      <footer className="mt-auto bg-black p-4 text-center text-white">
        <p>&copy; 2025 Exclusuive. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ApiDocsPage;
