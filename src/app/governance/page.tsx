'use client';

import { Navigation } from '@/components/navigation';
import { Governance } from '@/components/sacco/governance';

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