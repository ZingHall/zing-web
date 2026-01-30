import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./app/context/appContext";
import { Toaster } from "@/components/sonner";
import App from "./App"; // Make sure this path points to your actual App component
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/providers/theme-provider";
import { ZingClientProvider } from "@zing-protocol/zing-sdk";

// Network configuration
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

const queryClient = new QueryClient();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

const network = "testnet";
const suiClient = new SuiClient({ url: getFullnodeUrl(network) });
const suiGrpcClient = new SuiGrpcClient({
  network,
  baseUrl: getFullnodeUrl(network),
});

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork={network}>
        <WalletProvider autoConnect>
          <ZingClientProvider
            network={network}
            suiGrpcClient={suiGrpcClient}
            suiJsonRpcClient={suiClient}
          >
            <ThemeProvider defaultTheme="dark">
              <AppProvider>
                <BrowserRouter>
                  <App />
                </BrowserRouter>
                <Toaster position="top-right" />
              </AppProvider>
            </ThemeProvider>
          </ZingClientProvider>
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
