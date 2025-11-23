"use client";

import { ConnectButton } from "@mysten/dapp-kit";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-8 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src="/icon.svg"
            alt="Zing Watermark"
            width={80}
            height={80}
            priority
          />
          <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
            Zing Watermark
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </div>
    </nav>
  );
}
