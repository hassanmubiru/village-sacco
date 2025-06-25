'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useSaccoContract } from '@/hooks/use-sacco-contract';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  PiggyBank, 
  TrendingUp, 
  ArrowUpCircle, 
  ArrowDownCircle,
  Wallet,
  History,
  Loader2
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface SavingsTransaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  date: Date;
  transactionHash?: string;
  status: 'pending' | 'completed' | 'failed';
}

export function SavingsManagement() {
  const { userAddress, memberInfo, isApprovedMember } = useAuth();
  const { depositSavings, withdrawSavings, contract } = useSaccoContract();
  
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock transaction data - replace with actual API calls
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockTransactions: SavingsTransaction[] = [
          {
            id: '1',
            type: 'deposit',
            amount: 500,
            date: new Date('2024-01-15'),
            transactionHash: '0x123...abc',
            status: 'completed'
          },
          {
            id: '2',
            type: 'deposit', 
            amount: 250,
            date: new Date('2024-01-20'),
            transactionHash: '0x456...def',
            status: 'completed'
          },
          {
            id: '3',
            type: 'withdrawal',
            amount: 100,
            date: new Date('2024-01-25'),
            transactionHash: '0x789...ghi',
            status: 'completed'
          }
        ];
        
        setTransactions(mockTransactions);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isApprovedMember) {
      fetchTransactions();
    }
  }, [isApprovedMember]);

  const handleDeposit = async () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast.error('Please enter a valid deposit amount');
      return;
    }

    try {
      setIsDepositing(true);
      
      // Convert to wei (18 decimals)
      const amountInWei = (parseFloat(depositAmount) * 10**18).toString();
      
      const tx = await depositSavings({
        value: amountInWei,
      });

      toast.success('Deposit successful!');
      console.log('Deposit transaction:', tx);
      
      // Add to local transactions
      const newTransaction: SavingsTransaction = {
        id: Date.now().toString(),
        type: 'deposit',
        amount: parseFloat(depositAmount),
        date: new Date(),
        transactionHash: tx.transactionHash,
        status: 'completed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setDepositAmount('');
      
    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('Deposit failed. Please try again.');
    } finally {
      setIsDepositing(false);
    }
  };

  const handleWithdrawal = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error('Please enter a valid withdrawal amount');
      return;
    }

    const currentSavings = memberInfo?.totalSavings ? 
      Number(memberInfo.totalSavings) / 10**18 : 0;

    if (parseFloat(withdrawAmount) > currentSavings) {
      toast.error('Insufficient savings balance');
      return;
    }

    try {
      setIsWithdrawing(true);
      
      // Convert to wei (18 decimals)
      const amountInWei = (parseFloat(withdrawAmount) * 10**18).toString();
      
      const tx = await withdrawSavings({
        args: [amountInWei],
      });

      toast.success('Withdrawal successful!');
      console.log('Withdrawal transaction:', tx);
      
      // Add to local transactions
      const newTransaction: SavingsTransaction = {
        id: Date.now().toString(),
        type: 'withdrawal',
        amount: parseFloat(withdrawAmount),
        date: new Date(),
        transactionHash: tx.transactionHash,
        status: 'completed'
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      setWithdrawAmount('');
      
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (!isApprovedMember) {
    return (
      <div className="text-center py-8">
        <PiggyBank className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          Membership Required
        </h2>
        <p className="text-gray-500">
          You need to be an approved member to access savings features.
        </p>
      </div>
    );
  }

  const currentSavings = memberInfo?.totalSavings ? 
    Number(memberInfo.totalSavings) / 10**18 : 0;

  return (
    <div className="space-y-8">
      {/* Savings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(currentSavings)}
            </div>
            <p className="text-xs text-muted-foreground">
              Your total SACCO savings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SACCO Tokens</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSavings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              VST tokens earned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+12.5%</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Deposit */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowUpCircle className="w-5 h-5 text-green-600" />
              <span>Make Deposit</span>
            </CardTitle>
            <CardDescription>
              Add funds to your SACCO savings account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deposit-amount">Amount (ETH)</Label>
              <Input
                id="deposit-amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleDeposit}
              disabled={isDepositing || !depositAmount}
              className="w-full"
              size="lg"
            >
              {isDepositing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpCircle className="w-4 h-4 mr-2" />
                  Deposit Funds
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Withdraw */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ArrowDownCircle className="w-5 h-5 text-blue-600" />
              <span>Withdraw Savings</span>
            </CardTitle>
            <CardDescription>
              Withdraw from your SACCO savings account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="withdraw-amount">Amount (ETH)</Label>
              <Input
                id="withdraw-amount"
                type="number"
                step="0.01"
                min="0"
                max={currentSavings}
                placeholder="0.00"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Available: {formatCurrency(currentSavings)}
              </p>
            </div>
            <Button 
              onClick={handleWithdrawal}
              disabled={isWithdrawing || !withdrawAmount}
              variant="outline"
              className="w-full"
              size="lg"
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowDownCircle className="w-4 h-4 mr-2" />
                  Withdraw Funds
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <History className="w-5 h-5" />
            <span>Transaction History</span>
          </CardTitle>
          <CardDescription>
            Your recent savings transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/4" />
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'deposit' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {transaction.type === 'deposit' ? (
                        <ArrowUpCircle className="w-4 h-4" />
                      ) : (
                        <ArrowDownCircle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {transaction.type}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDate(transaction.date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      transaction.type === 'deposit' 
                        ? 'text-green-600' 
                        : 'text-blue-600'
                    }`}>
                      {transaction.type === 'deposit' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    <Badge variant={
                      transaction.status === 'completed' ? 'default' :
                      transaction.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}