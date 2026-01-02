import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./app/context/appContext";
import { Toaster } from "@/components/sonner";
import App from "./App"; // Make sure this path points to your actual App component
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/providers/theme-provider";

// Network configuration
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

const queryClient = new QueryClient();

// In Vite, we manually target the 'root' element
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider autoConnect>
            <ThemeProvider defaultTheme="dark">
              <AppProvider>
                <App />
                <Toaster position="top-right" />
              </AppProvider>
            </ThemeProvider>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
