'use client';

import { Navigation } from '@/components/navigation';
import dynamic from 'next/dynamic';

// Dynamically import the Governance component to prevent SSR issues
const Governance = dynamic(
  () => import('@/components/sacco/governance').then(mod => ({ default: mod.Governance })),
  { 
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-white p-6 rounded-lg border">
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
);

export default function GovernancePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            SACCO Governance
          </h1>
          <p className="text-gray-600">
            Participate in democratic decision-making by creating and voting on proposals.
          </p>
        </div>
        <Governance />
      </div>
    </div>
  );
}