"use client";

import { useGetStudioWorks, Work } from "@/app/hooks/queries/useGetStudioWorks";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { useState, useMemo } from "react";
import Image from "next/image";

export default function WorksTab() {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { data: works } = useGetStudioWorks(suiClient, currentAccount?.address);

  // Filter works based on search query
  // Filter works based on search query
  const filteredWorks = useMemo(() => {
    if (!works || !Array.isArray(works)) return [];

    if (!searchQuery.trim()) return works as Work[];

    return works.filter(
      (work) =>
        work.id.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (work.blobs[0]?.blob_id &&
          work.blobs[0].blob_id
            .toLowerCase()
            .includes(searchQuery.toLowerCase())),
    ) as Work[];
  }, [works, searchQuery]);

  // Handle search and auto-select if exact match found
  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() && works) {
      const exactMatch = works.find(
        (work) =>
          work.id.id.toLowerCase() === query.toLowerCase() ||
          (work.blobs[0]?.blob_id &&
            work.blobs[0].blob_id.toLowerCase() === query.toLowerCase()),
      );

      if (exactMatch) {
        setSelectedWork(exactMatch);
      }
    }
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024)
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  const formatStorageSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    if (size < 1024 * 1024 * 1024)
      return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg h-full">
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-zinc-50">
          My Works
        </h2>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search by Article ID or Blob ID..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-3 pl-10 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="flex h-[calc(100vh-200px)]">
        {/* Left Side - Works Grid */}
        <div className="w-1/2 p-6 border-r border-zinc-200 dark:border-zinc-700 overflow-y-auto">
          {!works || works.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-16 h-16 text-zinc-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                No works found
              </p>
              <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-2">
                Your watermarked works will appear here
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredWorks.map((work) => (
                <div
                  key={work.id.id}
                  onClick={() => setSelectedWork(work)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedWork?.id.id === work.id.id
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md"
                      : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Image
                          alt="zing-logo"
                          src={"/icon.svg"}
                          width={48}
                          height={48}
                        />
                      </div>
                    </div>

                    {/* Work Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-black dark:text-zinc-50 truncate">
                        Article ID: {work.id.id.slice(0, 20)}...
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Size: {formatFileSize(work.totalSize.toString())}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Epoch: {work.registeredEpoch}
                      </p>
                      <div className="flex items-center mt-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            work.deletable
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                          }`}
                        >
                          {work.deletable ? "Active" : "Archived"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side - Preview */}
        <div className="w-1/2 p-6 overflow-y-auto">
          {selectedWork ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-12 h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-2">
                  Work Details
                </h3>
              </div>

              {/* Metadata Cards */}
              <div className="space-y-4">
                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Article ID
                  </h4>
                  <p className="text-sm text-black dark:text-zinc-50 font-mono break-all">
                    {selectedWork.id.id}
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Blob ID
                  </h4>
                  <p className="text-sm text-black dark:text-zinc-50 font-mono break-all">
                    {selectedWork.blobs[0].id.id}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Encoded File Size
                    </h4>
                    <p className="text-sm text-black dark:text-zinc-50">
                      {formatFileSize(selectedWork.totalSize.toString())}
                    </p>
                  </div>

                  <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Encoding Type
                    </h4>
                    <p className="text-sm text-black dark:text-zinc-50">
                      {"RedStuff"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Registered Epoch
                    </h4>
                    <p className="text-sm text-black dark:text-zinc-50">
                      {selectedWork.registeredEpoch}
                    </p>
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
                    Storage Information
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        Storage ID:
                      </span>
                      <span className="text-xs text-black dark:text-zinc-50 font-mono">
                        {selectedWork.blobs[0].storage.id.id.slice(0, 20)}...
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        Storage Size:
                      </span>
                      <span className="text-xs text-black dark:text-zinc-50">
                        {formatStorageSize(selectedWork.storageSize.toString())}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-zinc-600 dark:text-zinc-400">
                        Duration:
                      </span>
                      <span className="text-xs text-black dark:text-zinc-50">
                        Epoch {selectedWork.blobs[0].storage.start_epoch} -{" "}
                        {selectedWork.blobs[0].storage.end_epoch}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-800 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Status
                    </h4>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        selectedWork.deletable
                          ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                      }`}
                    >
                      {selectedWork.deletable ? "Active" : "Archived"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg
                className="w-16 h-16 text-zinc-400 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <p className="text-zinc-500 dark:text-zinc-400 text-lg">
                Select a work to preview
              </p>
              <p className="text-zinc-400 dark:text-zinc-500 text-sm mt-2">
                Click on any work from the left panel to view its details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
