"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [embedFile, setEmbedFile] = useState<File | null>(null);
  const [embedMessage, setEmbedMessage] = useState("");
  const [embedLoading, setEmbedLoading] = useState(false);
  const [embedResult, setEmbedResult] = useState<string | null>(null);

  const [extractFile, setExtractFile] = useState<File | null>(null);
  const [extractLoading, setExtractLoading] = useState(false);
  const [extractedMessage, setExtractedMessage] = useState<string | null>(null);
  const [extractError, setExtractError] = useState<string | null>(null);

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
      setExtractError(error instanceof Error ? error.message : "Failed to extract message");
    } finally {
      setExtractLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={100}
            height={20}
            priority
          />
          <h1 className="text-3xl font-bold text-black dark:text-zinc-50">
            Steganography Test
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Embed Section */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
              Embed Message
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
                  Secret Message
                </label>
                <textarea
                  value={embedMessage}
                  onChange={(e) => setEmbedMessage(e.target.value)}
                  className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                  rows={4}
                  placeholder="Enter secret message to embed..."
                  required
                />
              </div>
              <button
                type="submit"
                disabled={embedLoading}
                className="w-full bg-black dark:bg-white text-white dark:text-black py-2 px-4 rounded font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {embedLoading ? "Embedding..." : "Embed Message"}
              </button>
            </form>

            {embedResult && (
              <div className="mt-4 space-y-2">
                <p className="text-green-600 dark:text-green-400 font-medium">
                  ✓ Message embedded successfully!
                </p>
                <a
                  href={embedResult}
                  download="embedded-image.png"
                  className="block w-full bg-zinc-100 dark:bg-zinc-800 text-center py-2 px-4 rounded hover:bg-zinc-200 dark:hover:bg-zinc-700 text-black dark:text-zinc-50"
                >
                  Download Embedded Image
                </a>
                <div className="border border-zinc-300 dark:border-zinc-700 rounded p-2">
                  <Image 
                    src={embedResult} 
                    alt="Embedded" 
                    width={800}
                    height={600}
                    className="w-full h-auto" 
                    unoptimized 
                  />
                </div>
              </div>
            )}
          </div>

          {/* Extract Section */}
          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
              Extract Message
            </h2>
            <form onSubmit={handleExtract} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
                  Upload PNG Image with Hidden Message
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
                {extractLoading ? "Extracting..." : "Extract Message"}
              </button>
            </form>

            {extractedMessage && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded">
                <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
                  Extracted Message:
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
        </div>

        <div className="mt-8 p-6 bg-zinc-100 dark:bg-zinc-900 rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-black dark:text-zinc-50">
            How It Works
          </h3>
          <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
            <li>• <strong>LSB Steganography:</strong> Hides data in the least significant bits of image pixels</li>
            <li>• <strong>PNG Format:</strong> Uses PNG images to preserve exact pixel values</li>
            <li>• <strong>Header:</strong> Includes magic string, version, and message length for validation</li>
            <li>• <strong>Test:</strong> Upload an image, embed a message, download it, then extract to verify</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
