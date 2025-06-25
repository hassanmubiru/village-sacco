'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useSaccoContract } from '@/hooks/use-sacco-contract';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  PiggyBank, 
  CreditCard, 
  Users, 
  Vote, 
  TrendingUp, 
  Shield,
  Wallet,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { MemberRegistration } from '@/components/sacco/member-registration';
import { ConnectWallet } from '@/components/connect-wallet';

export default function DashboardPage() {
  const { 
    isConnected, 
    isLoading: authLoading, 
    isMember, 
    isApprovedMember, 
    memberInfo 
  } = useAuth();
  
  const { 
    contractBalance, 
    totalMembers, 
    minimumSavings, 
    nextLoanId, 
    nextProposalId 
  } = useSaccoContract();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for dashboard data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show connection prompt
  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <PiggyBank className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome to Village SACCO
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A transparent, secure, and democratic savings and credit cooperative 
              organization powered by blockchain technology.
            </p>
            <ConnectWallet />
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="text-center">
                <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Transparent</h3>
                <p className="text-gray-600">All transactions recorded on blockchain for complete transparency</p>
              </div>
              <div className="text-center">
                <Vote className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Democratic Governance</h3>
                <p className="text-gray-600">Members vote on important decisions and proposals</p>
              </div>
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Financial Growth</h3>
                <p className="text-gray-600">Grow your savings and access fair loans</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show member registration if not a member
  if (isConnected && !isMember) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <MemberRegistration />
        </div>
      </div>
    );
  }

  // Show pending approval message
  if (isMember && !isApprovedMember) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Membership Pending Approval
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Your membership application has been submitted and is awaiting approval 
              from SACCO administrators.
            </p>
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Your Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{memberInfo?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{memberInfo?.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registered:</span>
                    <span className="font-medium">
                      {memberInfo?.registrationDate && 
                        formatDate(new Date(Number(memberInfo.registrationDate) * 1000))
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <Badge variant="secondary">Pending Approval</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard for approved members
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {memberInfo?.name}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your SACCO activities and the community status.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your Savings</CardTitle>
              <PiggyBank className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {memberInfo?.totalSavings ? formatCurrency(
                  Number(memberInfo.totalSavings) / 10**18
                ) : '$0.00'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {memberInfo?.totalLoansAmount ? formatCurrency(
                  Number(memberInfo.totalLoansAmount) / 10**18
                ) : '$0.00'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {totalMembers?.toString() || '0'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pool Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {contractBalance ? formatCurrency(
                  Number(contractBalance) / 10**18
                ) : '$0.00'}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common actions you can take in the SACCO
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start" size="lg">
                <PiggyBank className="w-5 h-5 mr-2" />
                Make a Deposit
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <CreditCard className="w-5 h-5 mr-2" />
                Apply for Loan
              </Button>
              <Button variant="outline" className="w-full justify-start" size="lg">
                <Vote className="w-5 h-5 mr-2" />
                View Proposals
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SACCO Information</CardTitle>
              <CardDescription>
                Key information about your cooperative
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Minimum Savings</span>
                <span className="font-medium">
                  {minimumSavings ? formatCurrency(
                    Number(minimumSavings) / 10**18
                  ) : '$10.00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Loans Issued</span>
                <span className="font-medium">{nextLoanId?.toString() || '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Proposals</span>
                <span className="font-medium">{nextProposalId?.toString() || '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Your Status</span>
                <Badge variant="default">Approved Member</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}