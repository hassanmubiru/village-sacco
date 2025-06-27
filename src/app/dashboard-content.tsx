'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useSaccoContract } from '@/hooks/use-sacco-contract';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

// DashboardSkeleton for loading states
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="h-[120px] rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-[200px] rounded-lg bg-muted animate-pulse" />
        <div className="space-y-4">
          <div className="h-[90px] rounded-lg bg-muted animate-pulse" />
          <div className="h-[90px] rounded-lg bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function DashboardContent() {
  const { memberInfo, isApprovedMember } = useAuth();
  const { 
    contractBalance, 
    totalMembers, 
    minimumSavings, 
    nextLoanId, 
    nextProposalId 
  } = useSaccoContract();

  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Use a shorter timeout or remove artificial delays
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <DashboardSkeleton />; // Show skeleton instead of null
  }
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {memberInfo?.name || 'Member'}
          </h1>
          <p className="text-gray-600">
            {isApprovedMember ? 'Approved Member' : 'Pending Approval'}
          </p>
        </div>
        {!isApprovedMember && (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <AlertCircle className="w-4 h-4 mr-1" />
            Pending Approval
          </Badge>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SACCO Balance</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contractBalance ? formatCurrency(contractBalance) : '---'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total funds in the cooperative
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalMembers ? totalMembers.toString() : '---'}
            </div>
            <p className="text-xs text-muted-foreground">
              Active cooperative members
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Savings</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {memberInfo ? formatCurrency(memberInfo.totalSavings) : '---'}
            </div>
            <p className="text-xs text-muted-foreground">
              My total contributions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {memberInfo ? formatCurrency(memberInfo.totalLoansAmount) : '---'}
            </div>
            <p className="text-xs text-muted-foreground">
              Outstanding loan amount
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks you can perform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" disabled={!isApprovedMember}>
              <PiggyBank className="w-4 h-4 mr-2" />
              Make Savings
            </Button>
            <Button variant="outline" className="w-full" disabled={!isApprovedMember}>
              <CreditCard className="w-4 h-4 mr-2" />
              Apply for Loan
            </Button>
            <Button variant="outline" className="w-full" disabled={!isApprovedMember}>
              <Vote className="w-4 h-4 mr-2" />
              View Proposals
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest transactions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Membership Approved</p>
                  <p className="text-xs text-muted-foreground">
                    {memberInfo && formatDate(Number(memberInfo.registrationDate))}
                  </p>
                </div>
              </div>
              {!isApprovedMember && (
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Awaiting Approval</p>
                    <p className="text-xs text-muted-foreground">
                      Your membership is under review
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-blue-600" />
              Security & Trust
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Your funds are secured by blockchain technology. All transactions 
              are transparent and immutable.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
              Community Growth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Join a growing community of savers and borrowers working together 
              for financial empowerment.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
