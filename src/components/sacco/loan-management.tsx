'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useSaccoContract } from '@/hooks/use-sacco-contract';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Loan {
  id: string;
  amount: number;
  interestRate: number;
  duration: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'repaid';
  appliedAt: Date;
  approvedAt?: Date;
  disbursedAt?: Date;
  totalRepaid: number;
}

export function LoanManagement() {
  const { userAddress, memberInfo, isApprovedMember } = useAuth();
  const { requestLoan, repayLoan, getLoanInfo, nextLoanId } = useSaccoContract();
  
  const [loans, setLoans] = useState<Loan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Loan application form state
  const [loanForm, setLoanForm] = useState({
    amount: '',
    duration: '',
    purpose: ''
  });

  // Mock loan data - replace with actual API calls
  useEffect(() => {
    const fetchLoans = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockLoans: Loan[] = [
          {
            id: '1',
            amount: 1000,
            interestRate: 5,
            duration: 12,
            purpose: 'Small business expansion',
            status: 'disbursed',
            appliedAt: new Date('2024-01-10'),
            approvedAt: new Date('2024-01-12'),
            disbursedAt: new Date('2024-01-15'),
            totalRepaid: 200
          },
          {
            id: '2',
            amount: 500,
            interestRate: 4,
            duration: 6,
            purpose: 'Agricultural inputs',
            status: 'pending',
            appliedAt: new Date('2024-01-25'),
            totalRepaid: 0
          }
        ];
        
        setLoans(mockLoans);
      } catch (error) {
        console.error('Error fetching loans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isApprovedMember) {
      fetchLoans();
    }
  }, [isApprovedMember]);

  const handleLoanApplication = async () => {
    if (!loanForm.amount || !loanForm.duration || !loanForm.purpose) {
      toast.error('Please fill in all fields');
      return;
    }

    const amount = parseFloat(loanForm.amount);
    const duration = parseInt(loanForm.duration);

    if (amount <= 0 || duration <= 0) {
      toast.error('Please enter valid amount and duration');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Convert to wei (18 decimals)
      const amountInWei = (amount * 10**18).toString();
      const interestRate = 500; // 5% in basis points
      
      const tx = await requestLoan({
        args: [amountInWei, interestRate, duration, loanForm.purpose],
      });

      toast.success('Loan application submitted successfully!');
      console.log('Loan application transaction:', tx);
      
      // Add to local loans
      const newLoan: Loan = {
        id: Date.now().toString(),
        amount,
        interestRate: 5,
        duration,
        purpose: loanForm.purpose,
        status: 'pending',
        appliedAt: new Date(),
        totalRepaid: 0
      };
      
      setLoans(prev => [newLoan, ...prev]);
      setLoanForm({ amount: '', duration: '', purpose: '' });
      setShowApplicationForm(false);
      
    } catch (error) {
      console.error('Loan application error:', error);
      toast.error('Loan application failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRepayment = async (loanId: string, amount: number) => {
    try {
      // Convert to wei (18 decimals)
      const amountInWei = (amount * Math.pow(10, 18)).toString();
      
      const tx = await repayLoan({
        args: [loanId, amountInWei],
      });

      toast.success('Loan repayment successful!');
      console.log('Loan repayment transaction:', tx);
      
      // Update local loan data
      setLoans(prev => prev.map(loan => 
        loan.id === loanId 
          ? { ...loan, totalRepaid: loan.totalRepaid + amount }
          : loan
      ));
      
    } catch (error) {
      console.error('Loan repayment error:', error);
      toast.error('Loan repayment failed. Please try again.');
    }
  };

  const getStatusColor = (status: Loan['status']) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'disbursed': return 'default';
      case 'repaid': return 'default';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: Loan['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'disbursed': return <DollarSign className="w-4 h-4" />;
      case 'repaid': return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!isApprovedMember) {
    return (
      <div className="text-center py-8">
        <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          Membership Required
        </h2>
        <p className="text-gray-500">
          You need to be an approved member to access loan features.
        </p>
      </div>
    );
  }

  const currentSavings = memberInfo?.totalSavings ? 
    Number(memberInfo.totalSavings) / 10**18 : 0;
  const minimumSavingsRequired = 10; // Mock minimum savings requirement

  return (
    <div className="space-y-8">
      {/* Loan Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loans.filter(l => l.status === 'disbursed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently outstanding
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(
                loans
                  .filter(l => l.status === 'disbursed')
                  .reduce((sum, l) => sum + l.amount, 0)
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Outstanding amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Loan Eligibility</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {currentSavings >= minimumSavingsRequired ? (
                <span className="text-green-600">Eligible</span>
              ) : (
                <span className="text-red-600">Not Eligible</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Min. savings: {formatCurrency(minimumSavingsRequired)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Apply for Loan */}
      <Card>
        <CardHeader>
          <CardTitle>Apply for Loan</CardTitle>
          <CardDescription>
            Submit a new loan application
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentSavings < minimumSavingsRequired ? (
            <div className="text-center py-8">
              <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Insufficient Savings
              </h3>
              <p className="text-gray-500 mb-4">
                You need at least {formatCurrency(minimumSavingsRequired)} in savings to be eligible for a loan.
              </p>
              <p className="text-sm text-gray-400">
                Current savings: {formatCurrency(currentSavings)}
              </p>
            </div>
          ) : !showApplicationForm ? (
            <div className="text-center py-8">
              <Button 
                onClick={() => setShowApplicationForm(true)}
                size="lg"
                className="min-w-48"
              >
                <FileText className="w-4 h-4 mr-2" />
                Apply for New Loan
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="loan-amount">Loan Amount (ETH)</Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={loanForm.amount}
                    onChange={(e) => setLoanForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loan-duration">Duration (months)</Label>
                  <Input
                    id="loan-duration"
                    type="number"
                    min="1"
                    max="60"
                    placeholder="12"
                    value={loanForm.duration}
                    onChange={(e) => setLoanForm(prev => ({ ...prev, duration: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="loan-purpose">Purpose of Loan</Label>
                <Textarea
                  id="loan-purpose"
                  placeholder="Describe what you will use this loan for..."
                  value={loanForm.purpose}
                  onChange={(e) => setLoanForm(prev => ({ ...prev, purpose: e.target.value }))}
                />
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={handleLoanApplication}
                  disabled={isSubmitting}
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowApplicationForm(false)}
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loan History */}
      <Card>
        <CardHeader>
          <CardTitle>Your Loans</CardTitle>
          <CardDescription>
            History of your loan applications and repayments
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : loans.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No loan applications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {loans.map((loan) => (
                <div key={loan.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(loan.status)}
                      <h3 className="font-semibold">
                        {formatCurrency(loan.amount)} Loan
                      </h3>
                    </div>
                    <Badge variant={getStatusColor(loan.status)}>
                      {loan.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Interest Rate</p>
                      <p className="font-medium">{loan.interestRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-medium">{loan.duration} months</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Applied</p>
                      <p className="font-medium">{formatDate(loan.appliedAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Repaid</p>
                      <p className="font-medium">
                        {formatCurrency(loan.totalRepaid)} / {formatCurrency(loan.amount + (loan.amount * loan.interestRate / 100))}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-500 text-sm">Purpose</p>
                    <p className="font-medium">{loan.purpose}</p>
                  </div>
                  
                  {loan.status === 'disbursed' && (
                    <div className="mt-4 pt-4 border-t">
                      <Button 
                        onClick={() => handleRepayment(loan.id, 100)}
                        size="sm"
                        variant="outline"
                      >
                        <DollarSign className="w-4 h-4 mr-2" />
                        Make Repayment
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}