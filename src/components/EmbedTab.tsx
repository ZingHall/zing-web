"use client";

import { useState } from "react";
import Image from "next/image";

export default function EmbedTab() {
  const [embedFile, setEmbedFile] = useState<File | null>(null);
  const [embedMessage, setEmbedMessage] = useState("");
  const [embedLoading, setEmbedLoading] = useState(false);
  const [embedResult, setEmbedResult] = useState<string | null>(null);

  const handleEmbed = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!embedFile || !embedMessage) return;

    setEmbedLoading(true);
    setEmbedResult(null);

    try {
      const formData = new FormData();
      formData.append("image", embedFile);
      formData.append("message", embedMessage);

      const response = await fetch("/api/stego/embed", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to embed message");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setEmbedResult(url);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to embed message");
    } finally {
      setEmbedLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
        Embed Watermark
      </h2>
      <form onSubmit={handleEmbed} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
            Upload PNG Image
          </label>
          <input
            type="file"
            accept="image/png"
            onChange={(e) => setEmbedFile(e.target.files?.[0] || null)}
            className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
            Watermark Message
          </label>
          <textarea
            value={embedMessage}
            onChange={(e) => setEmbedMessage(e.target.value)}
            className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
            rows={4}
            placeholder="Enter watermark message to embed..."
            required
          />
        </div>
        <button
          type="submit"
          disabled={embedLoading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {embedLoading ? "Embedding..." : "Embed Watermark"}
        </button>
      </form>

      {embedResult && (
        <div className="mt-4 space-y-2">
          <p className="text-green-600 dark:text-green-400 font-medium">
            ✓ Watermark embedded successfully!
          </p>
          <a
            href={embedResult}
            download="watermarked-image.png"
            className="block w-full bg-zinc-100 dark:bg-zinc-800 text-center py-2 px-4 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-black dark:text-zinc-50"
          >
            Download Watermarked Image
          </a>
          <div className="border border-zinc-300 dark:border-zinc-700 rounded p-2">
            <Image
              src={embedResult}
              alt="Watermarked"
              width={800}
              height={600}
              className="w-full h-auto"
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}
