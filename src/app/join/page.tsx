'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Navigation } from '@/components/navigation';
import { MemberRegistration } from '@/components/sacco/member-registration';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PiggyBank, Check, AlertCircle } from 'lucide-react';
import { Suspense } from 'react';
import Link from 'next/link';

// Skeleton loader for the registration form
const RegistrationSkeleton = () => (
  <div className="space-y-4">
    <div className="h-8 w-3/4 bg-slate-200 rounded animate-pulse mb-4" />
    <div className="h-24 w-full bg-slate-200 rounded animate-pulse" />
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-12 w-full bg-slate-200 rounded animate-pulse" />
      ))}
    </div>
    <div className="h-12 w-32 bg-slate-200 rounded animate-pulse mt-4" />
  </div>
);

export default function JoinPage() {
  const { isConnected, isLoading, isMember, isApprovedMember } = useAuth();
  const router = useRouter();

  // Redirect existing members to dashboard
  useEffect(() => {
    if (!isLoading && isConnected && isApprovedMember) {
      router.push('/');
    }
  }, [isApprovedMember, isConnected, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-8">
              <PiggyBank className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Join Village SACCO</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </CardHeader>
            <CardContent>
              <RegistrationSkeleton />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-8">
              <AlertCircle className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Connect Your Wallet First</CardTitle>
              <CardDescription>
                Please connect your wallet to join the Village SACCO
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-gray-600">
                You need to connect your wallet before you can register for membership.
              </p>
              <Button asChild size="lg">
                <Link href="/">Go to Homepage</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isMember && !isApprovedMember) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-8">
              <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <CardTitle className="text-2xl">Your Registration is Pending</CardTitle>
              <CardDescription>
                Your membership application is being reviewed
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="mb-6 text-gray-600">
                Thank you for registering with Village SACCO. Your application is currently being reviewed by our administrators.
                You'll receive a notification once your membership is approved.
              </p>
              <Button asChild size="lg">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="shadow-lg">
          <CardHeader className="text-center pb-8">
            <PiggyBank className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Join Village SACCO</CardTitle>
            <CardDescription>
              Complete the form below to become a member
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<RegistrationSkeleton />}>
              <MemberRegistration />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
