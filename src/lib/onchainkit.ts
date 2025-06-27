import { baseSepolia } from 'wagmi/chains';

export const onchainKitConfig = {
  apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY!,
  chain: baseSepolia,
};

export { baseSepolia };

// Wagmi configuration
export const wagmiConfig = {
  chains: [baseSepolia],
  transports: {
    [baseSepolia.id]: 'https://sepolia.base.org',
  },
};