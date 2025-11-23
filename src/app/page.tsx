"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import EmbedTab from "@/components/EmbedTab";
import ExtractTab from "@/components/ExtractTab";
import SetupStudioTab from "@/components/SetupStudioTab";
import PurchaseTierTab from "@/components/PurchaseTierTab";
import "@mysten/dapp-kit/dist/index.css";

const tabs = [
  { id: "studio", label: "Setup Studio", component: SetupStudioTab },
  { id: "purchase", label: "Purchase Plan", component: PurchaseTierTab },
  { id: "embed", label: "Embed Watermark", component: EmbedTab },
  { id: "extract", label: "Extract Watermark", component: ExtractTab },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("studio");

  const renderActiveComponent = () => {
    const ActiveComponent =
      tabs.find((tab) => tab.id === activeTab)?.component || EmbedTab;
    return <ActiveComponent setActiveTab={setActiveTab} />;
  };

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
        <div className="mb-8">{renderActiveComponent()}</div>

        {/* How It Works Section */}
        <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-black dark:text-zinc-50">
            How Zing Watermark Works
          </h3>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>
              • <strong>LSB Steganography:</strong> Embeds watermarks in the
              least significant bits of image pixels
            </li>
            <li>
              • <strong>Blockchain Integration:</strong> Uses Sui blockchain for
              secure watermark verification and ownership
            </li>
            <li>
              • <strong>Studio System:</strong> Create your own watermarking
              studio and monetize your services
            </li>
            <li>
              • <strong>Tier Plans:</strong> Choose from flexible pricing plans
              based on your watermarking needs
            </li>
            <li>
              • <strong>Format Support:</strong> Works with PNG, JPG, and WebP
              formats (depending on your plan)
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
