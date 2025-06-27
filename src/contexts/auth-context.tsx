'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { dateToBigIntSeconds } from '@/lib/utils';

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
  interface MemberInfo {
    name: string;
    email: string;
    isApproved: boolean;
    totalSavings: bigint;
    totalLoansAmount: bigint;
    registrationDate: bigint;
  }

  const [memberInfo, setMemberInfo] = useState<MemberInfo | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isApprovedMember, setIsApprovedMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Get user's wallet address from Privy
  const userAddress = user?.wallet?.address || null;

  const refreshMemberInfo = async () => {
    if (!userAddress) {
      setMemberInfo(null);
      setIsMember(false);
      setIsApprovedMember(false);
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Check if the user is already registered in the system
      // In a real implementation, this would query the blockchain or database
      const getMemberStatus = async () => {
        try {
          // In a production app, this would be a real API call to check membership status
          const response = await fetch(`/api/members/status?address=${userAddress}`, { cache: 'no-store' });
          if (response.ok) {
            const data = await response.json();
            return data;
          }
        } catch (err) {
          console.log('Could not fetch member status, using mock data instead');
        }
        
        // For demo purposes: using the last character of the address to determine status
        // This ensures users can test both membership flows
        const lastChar = userAddress.slice(-1).toLowerCase();
        const mockIsRegistered = parseInt(lastChar, 16) % 2 === 0; // Even last character = registered
        const mockIsApproved = parseInt(lastChar, 16) % 3 === 0; // Divisible by 3 = approved
        
        return {
          isMember: mockIsRegistered,
          isApproved: mockIsApproved && mockIsRegistered,
          memberData: mockIsRegistered ? {
            name: 'John Doe',
            email: user?.email?.address || 'john@example.com',
            isApproved: mockIsApproved && mockIsRegistered,
            totalSavings: BigInt(1000 * 10**18),
            totalLoansAmount: BigInt(0),
            registrationDate: dateToBigIntSeconds() // Using our safe utility function
          } : null
        };
      };
      
      const memberStatus = await getMemberStatus();
      
      setIsMember(memberStatus.isMember);
      setIsApprovedMember(memberStatus.isApproved);
      setMemberInfo(memberStatus.memberData);
      
      // Mock admin check - if address contains "admin" or ends with "ad"
      setIsAdmin(userAddress.toLowerCase().includes('admin') || 
                 userAddress.toLowerCase().slice(-2) === 'ad');
      
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