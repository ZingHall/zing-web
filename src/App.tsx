import { useState } from "react";
import Navbar from "@/components/Navbar";
import EmbedTab from "@/components/EmbedTab";
import StorageSpaceTab from "@/components/storageSpaceTab";
import StudioTab from "./components/StudioTab";

const tabs = [
  {
    id: "studio",
    label: "Studio",
    component: StudioTab,
  },
  {
    id: "storage-treasury",
    label: "Storage Treasury",
    component: StorageSpaceTab,
  },
  { id: "embed", label: "Embed", component: EmbedTab },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("studio");

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Navbar />
      <main className="max-w-6xl mx-auto p-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-zinc-200 dark:border-zinc-800">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-black dark:border-white text-black dark:text-white"
                      : "border-transparent text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-8">
          {tabs.map((tab) => {
            const Component = tab.component;
            return (
              <div
                key={tab.id}
                style={{ display: activeTab === tab.id ? "block" : "none" }}
              >
                <Component />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
