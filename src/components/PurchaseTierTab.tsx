"use client";

import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

const tiers = [
  {
    name: "Basic",
    price: "10 SUI",
    features: [
      "100 watermarks per month",
      "Basic templates",
      "Standard support",
      "PNG format only",
    ],
  },
  {
    name: "Pro",
    price: "25 SUI",
    features: [
      "1,000 watermarks per month",
      "Premium templates",
      "Priority support",
      "Multiple formats (PNG, JPG, WebP)",
      "Batch processing",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "100 SUI",
    features: [
      "Unlimited watermarks",
      "Custom templates",
      "24/7 dedicated support",
      "All formats supported",
      "API access",
      "White-label solution",
    ],
  },
];

export default function PurchaseTierTab() {
  const currentAccount = useCurrentAccount();
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (tierName: string, price: string) => {
    if (!currentAccount) {
      alert("Please connect your wallet first");
      return;
    }

    setLoading(tierName);
    try {
      // TODO: Implement tier purchase logic with Sui blockchain
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate transaction
      alert(`Successfully purchased ${tierName} tier!`);
    } catch (error) {
      alert("Failed to purchase tier");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
        Choose Your Plan
      </h2>

      {!currentAccount ? (
        <div className="text-center py-8">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            Connect your wallet to purchase a tier plan
          </p>
          <div className="text-sm text-zinc-500 dark:text-zinc-500">
            Use the connect button in the top navigation
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative border rounded-lg p-6 ${
                tier.popular
                  ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                  : "border-zinc-300 dark:border-zinc-700"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                  {tier.name}
                </h3>
                <div className="text-3xl font-bold text-black dark:text-zinc-50">
                  {tier.price}
                </div>
                <div className="text-sm text-zinc-600 dark:text-zinc-400">
                  per month
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span className="text-zinc-700 dark:text-zinc-300">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handlePurchase(tier.name, tier.price)}
                disabled={loading === tier.name}
                className={`w-full py-2 px-4 rounded font-medium transition-colors ${
                  tier.popular
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === tier.name
                  ? "Processing..."
                  : `Purchase ${tier.name}`}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-zinc-50 dark:bg-zinc-800 rounded">
        <h3 className="font-medium text-black dark:text-zinc-50 mb-2">
          Payment Information:
        </h3>
        <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
          <li>• Payments are processed on the Sui blockchain</li>
          <li>• All transactions are secure and transparent</li>
          <li>• Subscriptions auto-renew monthly</li>
          <li>• Cancel anytime from your dashboard</li>
        </ul>
      </div>
    </div>
  );
}
