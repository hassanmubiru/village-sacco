// Import lightweight UI components normally
'use client';

import { useEffect, useState, memo, useMemo, Suspense } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Navigation } from '@/components/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import { CardContent, CardHeader } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { useSaccoContract } from '@/hooks/use-sacco-contract';
import { ErrorBoundary } from 'react-error-boundary';

// Import lucide-react icons separately for better tree-shaking
import { AlertCircle, TrendingUp } from 'lucide-react';

// Dynamically import heavier components
const Card = dynamic(() => import('@/components/ui/card').then(mod => mod.Card), {
  ssr: false,
  loading: () => <div className="rounded-lg border p-4 shadow-sm"><Skeleton className="h-32" /></div>
});

const CardTitle = dynamic(() => import('@/components/ui/card').then(mod => mod.CardTitle), {
  ssr: false
});

// Dynamically import components
const ConnectWallet = dynamic(() => import('@/components/connect-wallet').then(mod => mod.ConnectWallet), {
  ssr: false,
  loading: () => <Button className="mx-auto">Loading wallet connect...</Button>
});

const MemberRegistration = dynamic(() => import('@/components/sacco/member-registration').then(mod => mod.MemberRegistration), {
  ssr: false,
  loading: () => <div><Skeleton className="h-64 w-full" /></div>
});

// Dynamic import for contract hooks - only loaded when needed
const DashboardContent = dynamic(() => 
  import('./dashboard-content').then(mod => mod.default), {
  ssr: false,
  loading: () => <DashboardSkeleton />
});

// Separate component for dashboard skeleton
const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="h-[120px] rounded-lg border bg-card shadow-sm animate-pulse" />
      ))}
    </div>
  </div>
);

// Import basic icons directly
import { 
  PiggyBank, 
  CreditCard, 
  Users, 
  Vote
} from 'lucide-react';

// Memoized stat card component for better performance
const StatCard = memo(({ title, value, description, icon: Icon, trend }: {
  title: string;
  value: string;
  description: string;
  icon: any;
  trend?: string;
}) => (
  <Card className="transition-shadow hover:shadow-md">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className="flex items-center pt-1">
          <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
          <span className="text-xs text-green-600">{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
));

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="p-4 border border-red-500 rounded-md bg-red-50 my-4">
      <h2 className="text-red-800 font-bold">Something went wrong</h2>
      <p className="text-sm text-red-600">{error.message}</p>
      <Button 
        variant="outline" 
        className="mt-2" 
        onClick={resetErrorBoundary}
      >
        Try again
      </Button>
    </div>
  );
}

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
    // Remove artificial delay and check if auth is ready
    if (!authLoading) {
      setIsLoading(false);
    }
  }, [authLoading]);

  const stats = useMemo(() => [
    {
      title: "Total Balance",
      value: contractBalance ? formatCurrency(Number(contractBalance)) : "Loading...",
      description: "Total SACCO funds",
      icon: PiggyBank,
      trend: "+12% from last month"
    },
    {
      title: "Total Members",
      value: totalMembers?.toString() || "0",
      description: "Registered members",
      icon: Users,
      trend: "+5 new this week"
    },
    {
      title: "Active Loans",
      value: nextLoanId ? (Number(nextLoanId) - 1).toString() : "0",
      description: "Current loans",
      icon: CreditCard
    },
    {
      title: "Proposals",
      value: nextProposalId ? (Number(nextProposalId) - 1).toString() : "0",
      description: "Active proposals",
      icon: Vote
    }
  ], [contractBalance, totalMembers, nextLoanId, nextProposalId]);

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
          </div>
        </div>
      </div>
    );
  }

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
              Your membership application is awaiting approval from SACCO administrators.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {memberInfo?.name || 'Member'}!
          </h1>
          <p className="text-gray-600">
            Here's an overview of your SACCO activities and community status.
          </p>
        </div>

        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<DashboardSkeleton />}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </div>

            <DashboardContent />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}