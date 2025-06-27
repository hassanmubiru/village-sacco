'use client';

import { Navigation } from '@/components/navigation';
import { SavingsManagement } from '@/components/sacco/savings-management';

export default function SavingsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Savings Management
          </h1>
          <p className="text-gray-600">
            Manage your SACCO savings, make deposits, and track your financial growth.
          </p>
        </div>
        <SavingsManagement />
      </div>
    </div>
  );
}