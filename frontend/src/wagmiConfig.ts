// wagmiConfig.ts
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import { arbitrum, mainnet, sepolia } from "wagmi/chains";

const projectId = import.meta.env.VITE_PROJECT_ID;

const metadata = {
  name: "NFT minting",
  description: "A NFT minting application developed by sanskar khandelwal",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};
const chains = [mainnet, arbitrum, sepolia] as const;

export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});
