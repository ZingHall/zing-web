"use client";

import { useState } from "react";

export default function ExtractTab() {
  const [extractFile, setExtractFile] = useState<File | null>(null);
  const [extractLoading, setExtractLoading] = useState(false);
  const [extractedMessage, setExtractedMessage] = useState<string | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extractFile) return;

    setExtractLoading(true);
    setExtractedMessage(null);
    setExtractError(null);

    try {
      const formData = new FormData();
      formData.append("image", extractFile);

      const response = await fetch("/api/stego/extract", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to extract message");
      }

      setExtractedMessage(data.message);
    } catch (error) {
      setExtractError(
        error instanceof Error ? error.message : "Failed to extract message",
      );
    } finally {
      setExtractLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
        Extract Watermark
      </h2>
      <form onSubmit={handleExtract} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
            Upload PNG Image with Hidden Watermark
          </label>
          <input
            type="file"
            accept="image/png"
            onChange={(e) => setExtractFile(e.target.files?.[0] || null)}
            className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
            required
          />
        </div>
        <button
          type="submit"
          disabled={extractLoading}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {extractLoading ? "Extracting..." : "Extract Watermark"}
        </button>
      </form>

      {extractedMessage && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
          <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
            Extracted Watermark:
          </p>
          <p className="text-black dark:text-zinc-50 whitespace-pre-wrap break-words">
            {extractedMessage}
          </p>
        </div>
      )}

      {extractError && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded">
          <p className="text-red-800 dark:text-red-300">{extractError}</p>
        </div>
      )}
    </div>
  );
}
