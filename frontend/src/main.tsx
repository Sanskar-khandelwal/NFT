import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./wagmiConfig.ts";

// 0. Setup queryClient
const queryClient = new QueryClient();
const projectId = import.meta.env.VITE_PROJECT_ID;

createWeb3Modal({
  wagmiConfig: config,
  projectId: projectId,
  enableAnalytics: true,
  enableOnramp: true,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
