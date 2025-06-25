'use client';

import { Navigation } from '@/components/navigation';
import { LoanManagement } from '@/components/sacco/loan-management';

export default function LoansPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Loan Management
          </h1>
          <p className="text-gray-600">
            Apply for loans, track applications, and manage repayments.
          </p>
        </div>
        <LoanManagement />
      </div>
    </div>
  );
}