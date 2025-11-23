"use client";

import React, { createContext, useContext, ReactNode, useMemo } from "react";
import { getFullnodeUrl } from "@mysten/sui/client";
import { walrus } from "@mysten/walrus";
import { SealClient } from "@mysten/seal";
import { SuiJsonRpcClient } from "@mysten/sui/jsonRpc";
import { useSuiClient } from "@mysten/dapp-kit";

const serverObjectIds = [
  "0x73d05d62c18d9374e3ea529e8e0ed6161da1a141a94d3f76ae3fe4e99356db75",
  "0xf5d14a81a982144ae441cd7d64b09027f116a468bd36e7eca494f750591623c8",
];

interface AppContextType {
  suiJsonRpcClient: SuiJsonRpcClient;
  sealClient: SealClient;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const suiClient = useSuiClient();

  const suiJsonRpcClient = useMemo(
    () =>
      new SuiJsonRpcClient({
        url: getFullnodeUrl("testnet"),
        // Setting network on your client is required for walrus to work correctly
        network: "testnet",
      }).$extend(walrus()),
    [],
  );

  const sealClient = useMemo(
    () =>
      new SealClient({
        suiClient,
        serverConfigs: serverObjectIds.map((id) => ({
          objectId: id,
          weight: 1,
        })),
        verifyKeyServers: false,
      }),
    [suiClient],
  );

  const value: AppContextType = {
    suiJsonRpcClient,
    sealClient,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext(): AppContextType {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
