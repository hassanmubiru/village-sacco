'use client';

import { ReactNode } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
<<<<<<< HEAD
import { baseSepolia } from 'thirdweb/chains';
=======
import { base, baseSepolia } from 'viem/chains';
>>>>>>> af4cee5 (Please enter the commit message for your changes. Lines starting)

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
<<<<<<< HEAD
      staleTime: 60 * 1000, // 1 minute
=======
      staleTime: 60 * 1000,
      retry: 3,
>>>>>>> af4cee5 (Please enter the commit message for your changes. Lines starting)
    },
  },
});

<<<<<<< HEAD
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
=======
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          loginMethods: ['email', 'wallet'],
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
          },
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
          defaultChain: baseSepolia,
          supportedChains: [base, baseSepolia],
        }}
      >
>>>>>>> af4cee5 (Please enter the commit message for your changes. Lines starting)
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}