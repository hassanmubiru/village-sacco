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
  return (
    <QueryClientProvider client={queryClient}>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
        config={{
          // Login methods
          loginMethods: ['email', 'wallet', 'sms'],
          
          // Appearance customization
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://your-logo-url.com/logo.png',
            showWalletLoginFirst: false,
          },
          
          // Embedded wallet configuration
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
            requireUserPasswordOnCreate: false,
          },
          
          // Legal configuration
          legal: {
            termsAndConditionsUrl: 'https://your-site.com/terms',
            privacyPolicyUrl: 'https://your-site.com/privacy',
          },
          
          // MFA configuration
          mfa: {
            noPromptOnMfaRequired: false,
          },
        }}
      >
        <ThirdwebProvider>
          {children}
        </ThirdwebProvider>
      </PrivyProvider>
    </QueryClientProvider>
  );
}