
import { createThirdwebClient } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Mock deployment for development and testing
export async function mockDeployVillageSACCO(
  privateKey: string,
  adminAddress: string
): Promise<string> {
  try {
    console.log("🚀 Mock deploying Village SACCO contract...");
    console.log("📝 Admin address:", adminAddress);

    // Simulate deployment delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate a mock contract address
    const mockContractAddress = `0x${Math.random().toString(16).slice(2).padStart(40, '0')}`;

    console.log("✅ Mock SACCO contract deployed successfully!");
    console.log("📄 Mock contract address:", mockContractAddress);
    console.log("🔗 View on BaseScan:", `https://sepolia.basescan.org/address/${mockContractAddress}`);

    // Store in localStorage for development
    if (typeof window !== 'undefined') {
      localStorage.setItem('SACCO_CONTRACT_ADDRESS', mockContractAddress);
      localStorage.setItem('SACCO_ADMIN_ADDRESS', adminAddress);
      localStorage.setItem('SACCO_DEPLOY_TIME', new Date().toISOString());
    }

    return mockContractAddress;
  } catch (error) {
    console.error("❌ Mock deployment failed:", error);
    throw error;
  }
}

// Get mock contract data
export function getMockContractInfo() {
  if (typeof window === 'undefined') return null;

  return {
    address: localStorage.getItem('SACCO_CONTRACT_ADDRESS'),
    admin: localStorage.getItem('SACCO_ADMIN_ADDRESS'),
    deployTime: localStorage.getItem('SACCO_DEPLOY_TIME'),
  };
}

// Clear mock deployment
export function clearMockDeployment() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('SACCO_CONTRACT_ADDRESS');
  localStorage.removeItem('SACCO_ADMIN_ADDRESS');
  localStorage.removeItem('SACCO_DEPLOY_TIME');
}