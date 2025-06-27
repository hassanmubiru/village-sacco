'use client';

import { ReactNode, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Dynamically import heavy blockchain providers
const ThirdwebProvider = dynamic(() => 
  import('thirdweb/react').then(mod => mod.ThirdwebProvider), {
  ssr: false,
});

const PrivyProvider = dynamic(() => 
  import('@privy-io/react-auth').then(mod => mod.PrivyProvider), {
  ssr: false,
});

interface ProvidersProps {
  children: ReactNode;
}

// Create a new QueryClient for each request in client components
export function Providers({ children }: ProvidersProps) {
  // Memoize query client to prevent recreating on each render
  const queryClient = useMemo(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 3,
        refetchOnWindowFocus: false, // Disable unneeded refetches
      },
    },
  }), []);

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