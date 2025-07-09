import { queryConfig } from "@/constants/react-query";
import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { registerSlushWallet } from "@mysten/slush-wallet";
import { Toaster } from "@/components/ui/sonner";

interface AppProviderProps {
  children: React.ReactNode;
}

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
  localnet: { url: getFullnodeUrl("localnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});

registerSlushWallet("Exclusuive");

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect={true}>
          <Toaster richColors />
          {children}
          <ReactQueryDevtools initialIsOpen={false} />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
};
