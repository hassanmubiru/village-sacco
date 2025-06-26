'use client';

import { Suspense, lazy } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Navigation } from '@/components/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardHeader } from '@/components/ui/card';
import { PiggyBank } from 'lucide-react';
import { ConnectWallet } from '@/components/connect-wallet';

// Lazy load heavy components to improve initial loading
const MemberRegistration = lazy(() => 
  import('@/components/sacco/member-registration').then(module => ({ 
    default: module.MemberRegistration 
  }))
);

const DashboardContent = lazy(() => import('./dashboard-content'));

// Loading component for better UX
function DashboardLoading() {
  return (
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-6 w-1/3 mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-4 w-full" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// Component loading fallback
function ComponentLoading() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

export default function DashboardPage() {
  const { 
    isConnected, 
    isLoading: authLoading, 
    isMember, 
    isApprovedMember, 
  } = useAuth();

  // Show loading state immediately
  if (authLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <DashboardLoading />
      </div>
    );
  }

  // Welcome screen for non-connected users
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

  // Member registration for non-members
  if (isConnected && !isMember) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<ComponentLoading />}>
            <MemberRegistration />
          </Suspense>
        </div>
      </div>
    );
  }

  // Main dashboard for approved members
  return (
    <div className="min-h-screen">
      <Navigation />
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}
