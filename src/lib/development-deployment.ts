import { createThirdwebClient, getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";

const client = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

// Complete SACCO ABI for development
const COMPLETE_SACCO_ABI = [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    inputs: [
      { name: "_name", type: "string", internalType: "string" },
      { name: "_symbol", type: "string", internalType: "string" },
      { name: "_initialAdmin", type: "address", internalType: "address" }
    ]
  },
  {
    type: "function",
    name: "registerMember",
    inputs: [
      { name: "_name", type: "string", internalType: "string" },
      { name: "_email", type: "string", internalType: "string" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "approveMember",
    inputs: [{ name: "_member", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "depositSavings",
    inputs: [],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "withdrawSavings",
    inputs: [{ name: "_amount", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "requestLoan",
    inputs: [
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_interestRate", type: "uint256", internalType: "uint256" },
      { name: "_duration", type: "uint256", internalType: "uint256" },
      { name: "_purpose", type: "string", internalType: "string" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "createProposal",
    inputs: [
      { name: "_title", type: "string", internalType: "string" },
      { name: "_description", type: "string", internalType: "string" }
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "vote",
    inputs: [
      { name: "_proposalId", type: "uint256", internalType: "uint256" },
      { name: "_vote", type: "bool", internalType: "bool" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getTotalMembers",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getContractBalance",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "minimumSavings",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "nextLoanId",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "nextProposalId",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view"
  }
] as const;

// Development deployment with proper error handling
export async function deployForDevelopment(
  adminAddress: string
): Promise<{ address: string; abi: typeof COMPLETE_SACCO_ABI }> {
  try {
    console.log("🚀 Deploying SACCO for development...");
    console.log("👤 Admin address:", adminAddress);

    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate deterministic mock address for consistency
    const mockAddress = `0x${adminAddress.slice(2, 10)}${'0'.repeat(32)}SACCO`;

    const deploymentInfo = {
      address: mockAddress,
      abi: COMPLETE_SACCO_ABI,
      deployedAt: new Date().toISOString(),
      network: 'Base Sepolia (Mock)',
      admin: adminAddress,
    };

    // Store in localStorage for persistence during development
    if (typeof window !== 'undefined') {
      localStorage.setItem('sacco_deployment', JSON.stringify(deploymentInfo));
    }

    console.log("✅ Development SACCO deployed successfully!");
    console.log("📄 Mock address:", mockAddress);

    return {
      address: mockAddress,
      abi: COMPLETE_SACCO_ABI,
    };
  } catch (error) {
    console.error("❌ Development deployment failed:", error);
    throw error;
  }
}

// Get development contract
export function getDevSaccoContract(contractAddress: string) {
  return getContract({
    client,
    chain: baseSepolia,
    address: contractAddress as `0x${string}`,
    abi: COMPLETE_SACCO_ABI,
  });
}

// Load deployment from localStorage
export function loadDevDeployment() {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('sacco_deployment');
  return stored ? JSON.parse(stored) : null;
}

// Clear development deployment
export function clearDevDeployment() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('sacco_deployment');
}