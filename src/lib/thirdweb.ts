import { createThirdwebClient } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

export const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export const chain = baseSepolia;

export const SACCO_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_SACCO_CONTRACT_ADDRESS!;