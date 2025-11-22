"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

export default function SetupStudioTab() {
  const currentAccount = useCurrentAccount();
  const [studioName, setStudioName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSetupStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement studio setup logic with Sui blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
      alert("Studio setup successful!");
      setStudioName("");
      setDescription("");
    } catch (error) {
      alert("Failed to setup studio");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
        Setup Your Watermark Studio
      </h2>

      {!currentAccount ? (
        <div className="text-center py-8">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Connect your wallet to setup your watermark studio
          </p>
          <div className="text-sm text-zinc-500 dark:text-zinc-500">
            Use the connect button in the top navigation
          </div>
        </div>
      ) : (
        <form onSubmit={handleSetupStudio} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Studio Name
            </label>
            <input
              type="text"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              placeholder="Enter your studio name..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              rows={4}
              placeholder="Describe your studio and watermarking services..."
              required
            />
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
            <h3 className="font-medium text-black dark:text-zinc-50 mb-2">
              Connected Wallet:
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono">
              {currentAccount.address}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Setting up..." : "Setup Studio"}
          </button>
        </form>
      )}

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
        <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
          Studio Benefits:
        </h3>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Create and manage watermark templates</li>
          <li>• Track watermarked content on-chain</li>
          <li>• Monetize your watermarking services</li>
          <li>• Build reputation and trust</li>
        </ul>
      </div>
    </div>
  );
}
