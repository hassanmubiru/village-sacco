//Proper ABI format for Thirdweb v5
export const VILLAGE_SACCO_ABI = [
  {
    type: "constructor",
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
  }
] as const;

// TypeScript interfaces remain the same
export interface MemberInfo {
  name: string;
  email: string;
  isApproved: boolean;
  totalSavings: bigint;
  totalLoansAmount: bigint;
  registrationDate: bigint;
}

export interface LoanInfo {
  borrower: string;
  amount: bigint;
  interestRate: bigint;
  duration: bigint;
  purpose: string;
  isApproved: boolean;
  isDisbursed: boolean;
  isRepaid: boolean;
  totalRepaid: bigint;
}

export interface ProposalInfo {
  title: string;
  description: string;
  proposer: string;
  yesVotes: bigint;
  noVotes: bigint;
  votingDeadline: bigint;
  executed: boolean;
  passed: boolean;
}

export interface ContractConfig {
  address: string;
  abi: typeof VILLAGE_SACCO_ABI;
  chainId: number;
}