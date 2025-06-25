'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useSaccoContract } from '@/hooks/use-sacco-contract';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  Users, 
  CreditCard, 
  Vote, 
  DollarSign,
  UserCheck,
  UserX,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Loader2,
  Settings,
  TrendingUp
} from 'lucide-react';
import { formatCurrency, formatDate, shortenAddress } from '@/lib/utils';

interface PendingMember {
  id: string;
  address: string;
  name: string;
  email: string;
  registrationDate: Date;
}

interface PendingLoan {
  id: string;
  borrower: string;
  amount: number;
  interestRate: number;
  duration: number;
  purpose: string;
  appliedAt: Date;
}

interface SaccoStats {
  totalMembers: number;
  pendingMembers: number;
  totalSavings: number;
  activeLoans: number;
  pendingLoans: number;
  contractBalance: number;
}

export function AdminDashboard() {
  const { isAdmin } = useAuth();
  const { approveMember, approveLoan, disburseLoan, executeProposal, contractBalance, totalMembers } = useSaccoContract();
  
  const [pendingMembers, setPendingMembers] = useState<PendingMember[]>([]);
  const [pendingLoans, setPendingLoans] = useState<PendingLoan[]>([]);
  const [stats, setStats] = useState<SaccoStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockPendingMembers: PendingMember[] = [
          {
            id: '1',
            address: '0x1234567890123456789012345678901234567890',
            name: 'John Doe',
            email: 'john@example.com',
            registrationDate: new Date('2024-01-25')
          },
          {
            id: '2',
            address: '0x2345678901234567890123456789012345678901',
            name: 'Jane Smith',
            email: 'jane@example.com',
            registrationDate: new Date('2024-01-26')
          },
          {
            id: '3',
            address: '0x3456789012345678901234567890123456789012',
            name: 'Michael Johnson',
            email: 'michael@example.com',
            registrationDate: new Date('2024-01-27')
          }
        ];

        const mockPendingLoans: PendingLoan[] = [
          {
            id: '1',
            borrower: '0x4567890123456789012345678901234567890123',
            amount: 500,
            interestRate: 5,
            duration: 12,
            purpose: 'Agricultural equipment purchase for maize farming',
            appliedAt: new Date('2024-01-24')
          },
          {
            id: '2',
            borrower: '0x5678901234567890123456789012345678901234',
            amount: 1000,
            interestRate: 5,
            duration: 18,
            purpose: 'Small business expansion - grocery store inventory',
            appliedAt: new Date('2024-01-25')
          },
          {
            id: '3',
            borrower: '0x6789012345678901234567890123456789012345',
            amount: 750,
            interestRate: 4,
            duration: 15,
            purpose: 'Education fees for children university',
            appliedAt: new Date('2024-01-26')
          }
        ];

        const mockStats: SaccoStats = {
          totalMembers: 45,
          pendingMembers: mockPendingMembers.length,
          totalSavings: 25750.50,
          activeLoans: 12,
          pendingLoans: mockPendingLoans.length,
          contractBalance: contractBalance ? Number(contractBalance) / 10**18 : 31200.75
        };
        
        setPendingMembers(mockPendingMembers);
        setPendingLoans(mockPendingLoans);
        setStats(mockStats);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, contractBalance]);

  const handleMemberApproval = async (memberAddress: string, approve: boolean) => {
    try {
      setProcessingId(memberAddress);
      
      if (approve) {
        const tx = await approveMember({
          args: [memberAddress],
        });
        
        toast.success('Member approved successfully!');
        console.log('Member approval transaction:', tx);
        
        // Remove from pending list
        setPendingMembers(prev => prev.filter(m => m.address !== memberAddress));
      } else {
        // For rejection, you might want to call a different contract method
        toast.success('Member rejected');
        setPendingMembers(prev => prev.filter(m => m.address !== memberAddress));
      }
      
    } catch (error) {
      console.error('Member approval error:', error);
      toast.error('Failed to process member approval');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLoanApproval = async (loanId: string, approve: boolean) => {
    try {
      setProcessingId(loanId);
      
      if (approve) {
        const tx = await approveLoan({
          args: [loanId],
        });
        
        toast.success('Loan approved successfully!');
        console.log('Loan approval transaction:', tx);
        
        // Update local state
        setPendingLoans(prev => prev.filter(l => l.id !== loanId));
      } else {
        // For rejection, you might want a different approach
        toast.success('Loan rejected');
        setPendingLoans(prev => prev.filter(l => l.id !== loanId));
      }
      
    } catch (error) {
      console.error('Loan approval error:', error);
      toast.error('Failed to process loan approval');
    } finally {
      setProcessingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          Admin Access Required
        </h2>
        <p className="text-gray-500">
          You need administrator privileges to access this section.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Admin Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalMembers || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingMembers || 0} pending approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-20" /> : formatCurrency(stats?.totalSavings || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-12" /> : stats?.activeLoans || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.pendingLoans || 0} awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contract Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? <Skeleton className="h-8 w-20" /> : formatCurrency(stats?.contractBalance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Available funds
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Member Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5" />
            <span>Pending Member Approvals</span>
          </CardTitle>
          <CardDescription>
            Review and approve new member registrations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))}
            </div>
          ) : pendingMembers.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No pending member approvals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-xs text-gray-400">
                        {shortenAddress(member.address)} • Registered {formatDate(member.registrationDate)}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleMemberApproval(member.address, true)}
                      disabled={processingId === member.address}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {processingId === member.address ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      onClick={() => handleMemberApproval(member.address, false)}
                      disabled={processingId === member.address}
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pending Loan Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Pending Loan Approvals</span>
          </CardTitle>
          <CardDescription>
            Review and approve loan applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-48" />
                    <div className="flex space-x-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : pendingLoans.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No pending loan approvals</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingLoans.map((loan) => (
                <div key={loan.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <h3 className="font-semibold">
                        {formatCurrency(loan.amount)} Loan Application
                      </h3>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleLoanApproval(loan.id, true)}
                        disabled={processingId === loan.id}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processingId === loan.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={() => handleLoanApproval(loan.id, false)}
                        disabled={processingId === loan.id}
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-gray-500">Borrower</p>
                      <p className="font-medium">{shortenAddress(loan.borrower)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Interest Rate</p>
                      <p className="font-medium">{loan.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium">{loan.duration} months</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Applied</p>
                      <p className="font-medium">{formatDate(loan.appliedAt)}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Purpose</p>
                    <p className="font-medium text-sm">{loan.purpose}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5" />
            <span>Admin Actions</span>
          </CardTitle>
          <CardDescription>
            Quick administrative functions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="w-6 h-6" />
              <span>Manage Members</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <DollarSign className="w-6 h-6" />
              <span>Financial Overview</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Vote className="w-6 h-6" />
              <span>Governance Settings</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}