'use client';

import { useState, useEffect } from 'react';
import { useContract, useContractRead, useContractWrite } from '@thirdweb-dev/react';
import { VILLAGE_SACCO_ABI, type MemberInfo, type LoanInfo, type ProposalInfo } from '@/lib/contract-abi';
import { SACCO_CONTRACT_ADDRESS, chain } from '@/lib/thirdweb';

export function useSaccoContract() {
  const { contract } = useContract(SACCO_CONTRACT_ADDRESS, VILLAGE_SACCO_ABI);
  
  // Contract read hooks
  const { data: contractBalance } = useContractRead(contract, "getContractBalance");
  const { data: totalMembers } = useContractRead(contract, "getTotalMembers"); 
  const { data: minimumSavings } = useContractRead(contract, "minimumSavings");
  const { data: nextLoanId } = useContractRead(contract, "nextLoanId");
  const { data: nextProposalId } = useContractRead(contract, "nextProposalId");
  
  // Contract write hooks
  const { mutateAsync: registerMember } = useContractWrite(contract, "registerMember");
  const { mutateAsync: depositSavings } = useContractWrite(contract, "depositSavings");
  const { mutateAsync: withdrawSavings } = useContractWrite(contract, "withdrawSavings");
  const { mutateAsync: requestLoan } = useContractWrite(contract, "requestLoan");
  const { mutateAsync: repayLoan } = useContractWrite(contract, "repayLoan");
  const { mutateAsync: createProposal } = useContractWrite(contract, "createProposal");
  const { mutateAsync: vote } = useContractWrite(contract, "vote");
  
  // Admin functions
  const { mutateAsync: approveMember } = useContractWrite(contract, "approveMember");
  const { mutateAsync: approveLoan } = useContractWrite(contract, "approveLoan");
  const { mutateAsync: disburseLoan } = useContractWrite(contract, "disburseLoan");
  const { mutateAsync: executeProposal } = useContractWrite(contract, "executeProposal");

  // Custom functions for reading complex data
  const getMemberInfo = async (address: string): Promise<MemberInfo | null> => {
    if (!contract) return null;
    try {
      const result = await contract.call("getMemberInfo", [address]);
      return {
        name: result[0],
        email: result[1], 
        isApproved: result[2],
        totalSavings: result[3],
        totalLoansAmount: result[4],
        registrationDate: result[5]
      };
    } catch (error) {
      console.error("Error getting member info:", error);
      return null;
    }
  };

  const getLoanInfo = async (loanId: number): Promise<LoanInfo | null> => {
    if (!contract) return null;
    try {
      const result = await contract.call("getLoanInfo", [loanId]);
      return {
        borrower: result[0],
        amount: result[1],
        interestRate: result[2], 
        duration: result[3],
        purpose: result[4],
        isApproved: result[5],
        isDisbursed: result[6],
        isRepaid: result[7],
        totalRepaid: result[8]
      };
    } catch (error) {
      console.error("Error getting loan info:", error);
      return null;
    }
  };

  const getProposalInfo = async (proposalId: number): Promise<ProposalInfo | null> => {
    if (!contract) return null;
    try {
      const result = await contract.call("getProposalInfo", [proposalId]);
      return {
        title: result[0],
        description: result[1],
        proposer: result[2],
        yesVotes: result[3],
        noVotes: result[4], 
        votingDeadline: result[5],
        executed: result[6],
        passed: result[7]
      };
    } catch (error) {
      console.error("Error getting proposal info:", error);
      return null;
    }
  };

  return {
    contract,
    // Read data
    contractBalance,
    totalMembers,
    minimumSavings,
    nextLoanId,
    nextProposalId,
    // Write functions - Member
    registerMember,
    depositSavings,
    withdrawSavings,
    requestLoan,
    repayLoan,
    createProposal,
    vote,
    // Write functions - Admin  
    approveMember,
    approveLoan,
    disburseLoan,
    executeProposal,
    // Custom read functions
    getMemberInfo,
    getLoanInfo,
    getProposalInfo,
  };
}