"use client";

import { useState } from "react";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useGetStudio } from "@/app/hooks/queries/useGetStudio";
import { useSetupStudio } from "@/app/hooks/mutations/useSetupStudio";
import { useGetStorageSpace } from "@/app/hooks/queries/useGetStorageSpace";

interface SetupStudioTabProps {
  setActiveTab: (tab: string) => void;
}

export default function SetupStudioTab({ setActiveTab }: SetupStudioTabProps) {
  const currentAccount = useCurrentAccount();
  const [setupFileKeyLoading, setSetupFileKeyLoading] = useState(false);

  const suiClient = useSuiClient();
  const { data: studio } = useGetStudio(suiClient, currentAccount?.address);
  console.log({ studio });
  const { data: storageSpace } = useGetStorageSpace(
    suiClient,
    currentAccount?.address,
  );
  console.log({ storageSpace });

  const { mutateAsync: setupStudio, isPending: isSettingupStudio } =
    useSetupStudio();
  const handleSetupStudio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      await setupStudio();
    } catch (error) {
      console.error({ error });
    }
  };

  const handleSetupFileKey = async () => {
    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }

    setSetupFileKeyLoading(true);
    try {
      // TODO: Implement file key setup logic
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API call
      alert("File key setup successful!");
    } catch (error) {
      alert("Failed to setup file key");
    } finally {
      setSetupFileKeyLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(parseInt(timestamp)).toLocaleDateString();
  };

  const isStudioActive = (period: string[]) => {
    if (!period || period.length < 2) return false;
    const now = Date.now();
    const startAt = parseInt(period[0]);
    const endAt = parseInt(period[1]);
    return now >= startAt && now <= endAt;
  };

  const getSubscriptionTiers = (monthlyFee: {
    contents: { key: number; value: string }[];
  }) => {
    return monthlyFee.contents.map((item) => ({
      tier: item.key,
      fee: item.value,
    }));
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
        {studio ? "Studio Dashboard" : "Setup Your Studio"}
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
      ) : studio ? (
        // Studio exists - show dashboard
        <div className="space-y-6">
          {/* Studio ID */}
          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
            <h3 className="font-medium text-black dark:text-zinc-50 mb-2">
              Studio ID
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-mono break-all">
              {studio.id.id}
            </p>
          </div>

          {/* Studio Status */}
          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
            <h3 className="font-medium text-black dark:text-zinc-50 mb-2">
              Studio Status
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 items-center">
                <div
                  className={`w-3 h-3 rounded-full ${isStudioActive(studio.period) ? "bg-green-500" : "bg-red-500"}`}
                ></div>
                <span
                  className={`text-sm font-medium ${isStudioActive(studio.period) ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                >
                  {isStudioActive(studio.period) ? "Active" : "Inactive"}
                </span>
              </div>
              {!isStudioActive(studio.period) && (
                <button
                  onClick={handleSetupFileKey}
                  disabled={setupFileKeyLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {setupFileKeyLoading
                    ? "Setting up..."
                    : "Go Purchase the Plan"}
                </button>
              )}
            </div>
            {studio.period &&
              studio.period.length >= 2 &&
              isStudioActive(studio.period) && (
                <div className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <p>Start: {formatTimestamp(studio.period[0])}</p>
                  <p>End: {formatTimestamp(studio.period[1])}</p>
                </div>
              )}
          </div>

          {/* Subscription Tiers */}
          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
            <h3 className="font-medium text-black dark:text-zinc-50 mb-2">
              Monthly Subscription Tiers
            </h3>
            <div className="space-y-2">
              {getSubscriptionTiers(studio.monthly_subscription_fee).map(
                (tier, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-zinc-600 dark:text-zinc-400">
                      Tier {tier.tier}
                    </span>
                    <span className="font-medium text-black dark:text-zinc-50">
                      {tier.fee} SUI
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
              <h3 className="font-medium text-black dark:text-zinc-50 mb-2">
                Membership Count
              </h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {studio.membership.size}
              </p>
            </div>
            <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
              <h3 className="font-medium text-black dark:text-zinc-50 mb-2">
                Published Works
              </h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {studio.works.size}
              </p>
            </div>
          </div>

          {/* File Key Status */}
          <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded">
            <h3 className="font-medium text-black dark:text-zinc-50 mb-2">
              File Key Status
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {studio.encrypted_file_key ? (
                  <>
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      Configured
                    </span>
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-red-600 dark:text-red-400 font-medium">
                      Not Configured
                    </span>
                  </>
                )}
              </div>
              {!studio.encrypted_file_key && (
                <button
                  onClick={handleSetupFileKey}
                  disabled={setupFileKeyLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {setupFileKeyLoading ? "Setting up..." : "Setup File Key"}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        // No studio - show setup form
        <div className="text-center py-8">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Setup your Studio to join Zing ecosystem
          </p>
          <button
            type="submit"
            disabled={isSettingupStudio}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSettingupStudio ? "Loading..." : "Embed Watermark"}
          </button>
        </div>
      )}

      {!studio && (
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
      )}
    </div>
  );
}
