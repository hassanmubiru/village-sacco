'use client';

import { usePrivy } from '@privy-io/react-auth';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

export function ConnectWallet() {
  const { login, ready } = usePrivy();

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button 
        onClick={login} 
        disabled={!ready}
        size="lg"
        className="min-w-48"
      >
        <Wallet className="w-5 h-5 mr-2" />
        Connect Wallet
      </Button>
      <p className="text-sm text-gray-500 max-w-md text-center">
        Connect your wallet to access your SACCO account. You can use MetaMask, 
        Coinbase Wallet, or create a new embedded wallet with just your email.
      </p>
    </div>
  );
}