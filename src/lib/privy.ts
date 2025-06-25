import { PrivyProvider } from '@privy-io/react-auth';
import { baseSepolia } from 'viem/chains';

export const privyConfig = {
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  config: {
    loginMethods: ['email', 'wallet', 'sms'],
    appearance: {
      theme: 'light',
      accentColor: '#676FFF',
    },
    embeddedWallets: {
      createOnLogin: 'users-without-wallets',
      requireUserPasswordOnCreate: false,
    },
    defaultChain: baseSepolia,
    supportedChains: [baseSepolia],
  },
};