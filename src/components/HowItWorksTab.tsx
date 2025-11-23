"use client";

export default function HowItWorksTab() {
  const steps = [
    {
      title: "Set Up Your Personal Studio",
      description:
        "Create your own studio to manage your content and followers. Manage your content & memberships in single place.",
    },
    {
      title: "Choose a Subscription Plan",
      description:
        "Select a tier plan based on your watermarking and platform needs. Subscription unlocks publishing eligibility and premium features.",
    },
    {
      title: "Configure Your Secret Key",
      description:
        "Generate your personal secret key to encrypt and decrypt your content. Only you can access your encrypted files.",
    },
    {
      title: "Upload & Publish Content",
      description:
        "Upload your digital content (images, media, audio). Each file is encrypted and embedded with a traceable watermark.",
    },
    {
      title: "Content Request & Verification",
      description:
        "Our Nautilus server verifies every content request for signature, membership level, and privacy rules. Authorized users receive watermarked content.",
    },
    {
      title: "Secure Ownership & Tracking",
      description:
        "Each watermark contains your signature and address. On-chain verification ensures copyright protection and tracks content leaks.",
    },
  ];

  return (
    <div className="p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg space-y-6">
      <h3 className="text-2xl font-semibold text-black dark:text-zinc-50 text-center">
        How Zing Watermark Works
      </h3>
      <p className="text-zinc-700 dark:text-zinc-300 text-center">
        Protect and manage your digital content with our decentralized
        watermarking service. Leverage Sui&apos;s native tools (Seal &
        Nautilus) for encryption, traceable watermarks, and on-chain
        verification.
      </p>

      <ul className="space-y-4">
        {steps.map((step, index) => (
          <li key={index} className="flex flex-col space-y-1">
            <h4 className="text-lg font-semibold text-black dark:text-zinc-50">
              {index + 1}. {step.title}
            </h4>
            <p className="text-zinc-700 dark:text-zinc-300">
              {step.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
