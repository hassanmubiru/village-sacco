'use client';

import { useState } from 'react';
import { Navigation } from '@/components/navigation';
import { AdminDashboard } from '@/components/sacco/admin-dashboard';
import { ContractDeployment } from '@/components/sacco/contract-deployment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Settings, Rocket } from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'contracts'>('dashboard');

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage SACCO operations, approve members and loans, and oversee governance.
          </p>
        </div>

        {/* Tab Navigation */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex space-x-4">
              <Button
                variant={activeTab === 'dashboard' ? 'default' : 'outline'}
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
              <Button
                variant={activeTab === 'contracts' ? 'default' : 'outline'}
                onClick={() => setActiveTab('contracts')}
                className="flex items-center space-x-2"
              >
                <Rocket className="w-4 h-4" />
                <span>Smart Contracts</span>
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Tab Content */}
        {activeTab === 'dashboard' && <AdminDashboard />}
        {activeTab === 'contracts' && <ContractDeployment />}
      </div>
    </div>
  );
}