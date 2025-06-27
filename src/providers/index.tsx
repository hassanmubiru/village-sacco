'use client';

import { ReactNode, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PrivyProvider } from '@privy-io/react-auth';
import { ThirdwebProvider } from 'thirdweb/react';

// Create QueryClient with proper error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10,   // 10 minutes (garbage collection time)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: 'always',
    },
    mutations: {
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: ReactNode;
}

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Loading Village SACCO</h2>
        <p className="text-gray-500">Preparing your financial cooperative platform...</p>
      </div>
    </div>
  );
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-red-800 mb-2">Configuration Error</h2>
        <p className="text-red-600 text-sm mb-4">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Reload Application
        </button>
      </div>
    </div>
  );
}

export function Providers({ children }: ProvidersProps) {
  // Validate required environment variables
  if (!process.env.NEXT_PUBLIC_PRIVY_APP_ID) {
    return (
      <ErrorFallback 
        error={new Error('NEXT_PUBLIC_PRIVY_APP_ID is required but not configured')} 
      />
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingFallback />}>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
          config={{
            // Core authentication methods
            loginMethods: ['email', 'wallet'],
            
            // UI customization
            appearance: {
              theme: 'light',
              accentColor: '#676FFF',
              logo: undefined, // Add your logo URL here if available
            },
            
            // Embedded wallet configuration
            embeddedWallets: {
              createOnLogin: 'users-without-wallets',
              requireUserPasswordOnCreate: false,
            },
            
            // Legal and compliance
            legal: {
              termsAndConditionsUrl: undefined, // Add if you have terms
              privacyPolicyUrl: undefined,      // Add if you have privacy policy
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
      </Suspense>
    </QueryClientProvider>
  );
}