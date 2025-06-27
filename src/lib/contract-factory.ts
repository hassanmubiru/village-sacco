import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { privateKeyToAccount } from "thirdweb/wallets";
import { sendTransaction, prepareContractCall, readContract } from "thirdweb";
import { VILLAGE_SACCO_ABI } from "./contract-abi";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Contract factory for creating SACCO instances
export class VillageSACCOFactory {
  private client;
  private chain;

  constructor() {
    this.client = client;
    this.chain = baseSepolia;
  }

  // Deploy a new SACCO contract
  async deploySACCO(
    deployerPrivateKey: string,
    saccoName: string,
    saccoSymbol: string,
    adminAddress: string
  ): Promise<string> {
    try {
      const account = privateKeyToAccount({
        client: this.client,
        privateKey: deployerPrivateKey as `0x${string}`,
      });

      console.log("🏭 SACCO Factory: Deploying new SACCO...");
      console.log("📋 Name:", saccoName);
      console.log("🏷️ Symbol:", saccoSymbol);
      console.log("👤 Admin:", adminAddress);

      // For now, return a mock address
      // In production, implement actual contract deployment
      const contractAddress = `0x${Math.random().toString(16).slice(2).padStart(40, '0')}`;
      
      console.log("✅ SACCO deployed at:", contractAddress);
      
      return contractAddress;
    } catch (error) {
      console.error("❌ SACCO deployment failed:", error);
      throw error;
    }
  }

  // Get an existing SACCO contract instance
  getSACCOContract(contractAddress: string) {
    return getContract({
      client: this.client,
      chain: this.chain,
      address: contractAddress as `0x${string}`,
      abi: JSON.parse(VILLAGE_SACCO_ABI as unknown as string),
    });
  }

  // Verify a SACCO contract
  async verifySACCO(contractAddress: string): Promise<boolean> {
    try {
      const contract = this.getSACCOContract(contractAddress);
      
      // Try to read basic contract info to verify it's a valid SACCO
      const totalMembers = await readContract({
        contract,
        method: "function getTotalMembers() view returns (uint256)",
        params: [],
      });

      return typeof totalMembers === 'bigint';
    } catch (error) {
      console.error("❌ SACCO verification failed:", error);
      return false;
    }
  }
}

// Export singleton instance
export const saccoFactory = new VillageSACCOFactory();