'use client';

import { ReactNode } from 'react';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { PrivyProvider } from '@privy-io/react-auth';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider } from '@privy-io/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { client, chain } from '@/lib/thirdweb';
import { privyConfig } from '@/lib/privy';
import { onchainKitConfig } from '@/lib/onchainkit';

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient();

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider {...privyConfig}>
        <WagmiProvider>
          <ThirdwebProvider
            clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!}
            activeChain={chain}
          >
            <OnchainKitProvider
              apiKey={onchainKitConfig.apiKey}
              chain={onchainKitConfig.chain}
            >
              {children}
            </OnchainKitProvider>
          </ThirdwebProvider>
        </WagmiProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}