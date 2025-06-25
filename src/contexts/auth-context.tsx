'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useAddress } from '@thirdweb-dev/react';
import { useSaccoContract } from '@/hooks/use-sacco-contract';

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
  const { ready, authenticated } = usePrivy();
  const address = useAddress();
  const { getMemberInfo, contract } = useSaccoContract();
  
  const [isLoading, setIsLoading] = useState(true);
  const [memberInfo, setMemberInfo] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [isApprovedMember, setIsApprovedMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const refreshMemberInfo = async () => {
    if (!address || !contract) {
      setMemberInfo(null);
      setIsMember(false);
      setIsApprovedMember(false);
      setIsAdmin(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Get member info
      const info = await getMemberInfo(address);
      setMemberInfo(info);
      
      if (info) {
        setIsMember(true);
        setIsApprovedMember(info.isApproved);
      } else {
        setIsMember(false);
        setIsApprovedMember(false);
      }

      // Check if user is admin
      try {
        const adminRole = await contract.call("ADMIN_ROLE");
        const hasAdminRole = await contract.call("hasRole", [adminRole, address]);
        setIsAdmin(hasAdminRole);
      } catch (error) {
        console.error("Error checking admin role:", error);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error refreshing member info:", error);
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
  }, [ready, authenticated, address, contract]);

  const value: AuthContextType = {
    isConnected: ready && authenticated && !!address,
    userAddress: address || null,
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