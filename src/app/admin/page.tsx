'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { AdminDashboard } from '@/components/sacco/admin-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Users, Settings, CreditCard, FileText } from 'lucide-react';
import { Navigation } from '@/components/navigation';
import { Suspense } from 'react';

// Skeleton loader for the admin dashboard
function AdminDashboardSkeleton() {
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

export default function AdminPage() {
  const { isAdmin, isConnected, isLoading } = useAuth();
  const router = useRouter();

  // Redirect non-admins to home page
  useEffect(() => {
    if (!isLoading && isConnected && !isAdmin) {
      router.push('/');
      return;
    }
  }, [isAdmin, isConnected, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminDashboardSkeleton />
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
              You need to connect your wallet to access the admin dashboard.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              You don't have permission to access the admin dashboard.
            </p>
            <Button onClick={() => router.push('/')} size="lg">
              Return Home
            </Button>
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
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage members, proposals, loans, and system settings.
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full max-w-3xl mb-6">
            <TabsTrigger value="overview">
              <FileText className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Members
            </TabsTrigger>
            <TabsTrigger value="loans">
              <CreditCard className="h-4 w-4 mr-2" />
              Loans
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="logs">
              <FileText className="h-4 w-4 mr-2" />
              Audit Logs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <Suspense fallback={<AdminDashboardSkeleton />}>
              <AdminDashboard />
            </Suspense>
          </TabsContent>
          
          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Member Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <AdminMembersTab />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="loans">
            <Card>
              <CardHeader>
                <CardTitle>Loan Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <AdminLoansTab />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <AdminSettingsTab />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <AdminLogsTab />
                </Suspense>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// Placeholder components for admin tabs
// These would be implemented as separate components in a real app
function AdminMembersTab() {
  return <div>Member management functionality will be implemented here</div>;
}

function AdminLoansTab() {
  return <div>Loan management functionality will be implemented here</div>;
}

function AdminSettingsTab() {
  return <div>Settings management functionality will be implemented here</div>;
}

function AdminLogsTab() {
  return <div>Audit logs functionality will be implemented here</div>;
}
