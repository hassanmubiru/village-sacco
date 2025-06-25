import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base, baseSepolia } from 'wagmi/chains';

export const onchainKitConfig = {
  apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY!,
  chain: baseSepolia, // Use baseSepolia for testing, base for production
};

export { base, baseSepolia }