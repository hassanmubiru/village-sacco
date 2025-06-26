'use client';

import { ReactNode } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';
import { PrivyProvider } from '@privy-io/react-auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 3,
    },
  },
});

export function Providers({ children }: ProvidersProps) {
  // Validate required environment variables
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    throw new Error('NEXT_PUBLIC_PRIVY_APP_ID is required');
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
        config={{
          // Login methods for SACCO users
          loginMethods: ['email', 'wallet'],
          
          // Appearance for SACCO branding
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            showWalletLoginFirst: false,
          },
          
          // Embedded wallets for easy onboarding
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
            requireUserPasswordOnCreate: false,
          },
          
          // SACCO-specific settings
          captchaEnabled: false,
          
          // Optional: Add legal links when available
          // legal: {
          //   termsAndConditionsUrl: 'https://your-sacco-site.com/terms',
          //   privacyPolicyUrl: 'https://your-sacco-site.com/privacy',
          // },
        }}
      >
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}