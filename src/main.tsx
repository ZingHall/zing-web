import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/sonner";
import App from "./App"; // Make sure this path points to your actual App component
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/providers/theme-provider";
import { ZingClientProvider } from "@zing-protocol/zing-sdk";
import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { walrus } from "@mysten/walrus";
import { createDAppKit, DAppKitProvider } from "@mysten/dapp-kit-react";

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const GRPC_URLS = {
  mainnet: "https://fullnode.mainnet.sui.io:443",
  testnet: "https://fullnode.testnet.sui.io:443",
} as const;

const GRAPHQL_URLS = {
  mainnet: "https://graphql.mainnet.sui.io/graphql",
  testnet: "https://graphql.testnet.sui.io/graphql",
} as const;

const network =
  (import.meta.env.VITE_NETWORK as "testnet" | "mainnet") || "mainnet";

const suiGrpcClient = new SuiGrpcClient({
  network,
  baseUrl: GRPC_URLS[network],
}).$extend(walrus());

const suiGraphQLClient = new SuiGraphQLClient({
  network,
  url: GRAPHQL_URLS[network],
});

const dAppKit = createDAppKit({
  networks: [network],
  createClient() {
    return suiGrpcClient;
  },
});

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DAppKitProvider dAppKit={dAppKit}>
        <ZingClientProvider
          network={network}
          suiGrpcClient={suiGrpcClient}
          suiGraphQLClient={suiGraphQLClient}
        >
          <ThemeProvider defaultTheme="dark">
            <BrowserRouter>
              <App />
            </BrowserRouter>
            <Toaster position="top-right" />
          </ThemeProvider>
        </ZingClientProvider>
      </DAppKitProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
