'use client';

import { ReactNode } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { baseSepolia } from 'thirdweb/chains';

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

// Privy configuration
const privyConfig = {
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  config: {
    loginMethods: ['email', 'wallet', 'sms'] as const,
    appearance: {
      theme: 'light' as const,
      accentColor: '#676FFF',
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets' as const,
      requireUserPasswordOnCreate: false,
    },
    defaultChain: baseSepolia,
    supportedChains: [baseSepolia],
  },
};

export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider {...privyConfig}>
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}