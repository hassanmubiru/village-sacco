'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface AuthContextType {
  isConnected: boolean;
  userAddress: string | null;
  isLoading: boolean;
  isMember: boolean;
  isApprovedMember: boolean;
  isAdmin: boolean;
  memberInfo: any;
  refreshMemberInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { ready, authenticated, user } = usePrivy();
  
  const [isLoading, setIsLoading] = useState(true);
<<<<<<< HEAD
  const [memberInfo, setMemberInfo] = useState(null);
=======
  const [memberInfo, setMemberInfo] = useState<{
    name: string;
    email: string;
    isApproved: boolean;
    totalSavings: bigint;
    totalLoansAmount: bigint;
    registrationDate: bigint;
  } | null>(null);
>>>>>>> af4cee5 (Please enter the commit message for your changes. Lines starting)
  const [isMember, setIsMember] = useState(false);
  const [isApprovedMember, setIsApprovedMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

<<<<<<< HEAD
  // Get user's wallet address
=======
  // Get user's wallet address from Privy
>>>>>>> af4cee5 (Please enter the commit message for your changes. Lines starting)
  const userAddress = user?.wallet?.address || null;

  const refreshMemberInfo = async () => {
    if (!userAddress) {
      setMemberInfo(null);
      setIsMember(false);
      setIsApprovedMember(false);
      setIsAdmin(false);
<<<<<<< HEAD
=======
      setIsLoading(false);
>>>>>>> af4cee5 (Please enter the commit message for your changes. Lines starting)
      return;
    }

    try {
      setIsLoading(true);
      
<<<<<<< HEAD
      // Mock member info for now - replace with actual API call
      const mockMemberInfo = {
        name: 'John Doe',
        email: 'john@example.com',
        isApproved: true,
        totalSavings: BigInt(1000 * 10**18), // 1000 ETH in wei
=======
      // Mock member info - replace with actual API call
      const mockMemberInfo = {
        name: 'John Doe',
        email: user?.email?.address || 'john@example.com',
        isApproved: true,
        totalSavings: BigInt(1000 * 10**18),
>>>>>>> af4cee5 (Please enter the commit message for your changes. Lines starting)
        totalLoansAmount: BigInt(0),
        registrationDate: BigInt(Date.now() / 1000)
      };
      
      setMemberInfo(mockMemberInfo);
      setIsMember(true);
      setIsApprovedMember(mockMemberInfo.isApproved);
      
<<<<<<< HEAD
      // Mock admin check - replace with actual role check
      setIsAdmin(userAddress.toLowerCase().includes('admin'));
=======
      // Mock admin check
      setIsAdmin(userAddress.toLowerCase().includes('1234'));
>>>>>>> af4cee5 (Please enter the commit message for your changes. Lines starting)
      
    } catch (error) {
      console.error('Error refreshing member info:', error);
      setMemberInfo(null);
      setIsMember(false);
      setIsApprovedMember(false);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (ready) {
      refreshMemberInfo();
    }
  }, [ready, authenticated, userAddress]);

  const value: AuthContextType = {
    isConnected: ready && authenticated && !!userAddress,
    userAddress,
    isLoading,
    isMember,
    isApprovedMember,
    isAdmin,
    memberInfo,
    refreshMemberInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}