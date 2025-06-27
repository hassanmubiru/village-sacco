'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Navigation } from '@/components/navigation';
import { Governance } from '@/components/sacco/governance';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Vote, Plus, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Suspense } from 'react';

function GovernanceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

export default function GovernancePage() {
  const { isConnected, isLoading, isApprovedMember } = useAuth();
  const [activeTab, setActiveTab] = useState('active');

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <GovernanceSkeleton />
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
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Connect Your Wallet
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              You need to connect your wallet to access the governance platform.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isApprovedMember) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Membership Required
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              You need to be an approved member to participate in governance.
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Governance Platform
            </h1>
            <p className="text-gray-600">
              Vote on proposals and contribute to the future of the SACCO
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Proposal
          </Button>
        </div>

        <Tabs defaultValue="active" className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
            <TabsTrigger value="active">
              <Vote className="h-4 w-4 mr-2" />
              Active
            </TabsTrigger>
            <TabsTrigger value="past">
              <ThumbsUp className="h-4 w-4 mr-2" />
              Passed
            </TabsTrigger>
            <TabsTrigger value="rejected">
              <ThumbsDown className="h-4 w-4 mr-2" />
              Rejected
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-6">
            <Suspense fallback={<GovernanceSkeleton />}>
              <Governance filter={activeTab} />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="past" className="space-y-6">
            <Suspense fallback={<GovernanceSkeleton />}>
              <Governance filter={activeTab} />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="rejected" className="space-y-6">
            <Suspense fallback={<GovernanceSkeleton />}>
              <Governance filter={activeTab} />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
