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

/**
 * Verify JWT token from Privy
 * In a production app, you would use Privy's verification SDK
 */
export async function verifyJWT(token: string) {
  try {
    // In production, you would use Privy's verification SDK
    // const { user } = await privy.verifyAuthToken(token);

    // For development purposes, we're returning a dummy verification
    // This should be replaced with actual token verification in production
    return {
      id: 'user-123',
      walletAddress: '0x1234567890123456789012345678901234567890',
      email: 'user@example.com',
    };
  } catch (error) {
    console.error('Error verifying JWT:', error);
    return null;
  }
}