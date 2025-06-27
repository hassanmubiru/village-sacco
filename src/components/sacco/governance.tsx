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
  Vote, 
  Plus, 
  ThumbsUp, 
  ThumbsDown,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Loader2
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface Proposal {
  id: string;
  title: string;
  description: string;
  proposer: string;
  yesVotes: number;
  noVotes: number;
  createdAt: Date;
  expiresAt: Date;
  status: 'active' | 'passed' | 'rejected' | 'expired';
  hasVoted: boolean;
  userVote?: boolean;
}

interface GovernanceProps {
  filter?: string;
}

export function Governance({ filter = 'active' }: GovernanceProps) {
  const { userAddress, isApprovedMember } = useAuth();
  const { createProposal, vote, getProposalInfo, nextProposalId } = useSaccoContract();
  
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [votingProposalId, setVotingProposalId] = useState<string | null>(null);
  
  // Proposal form state
  const [proposalForm, setProposalForm] = useState({
    title: '',
    description: ''
  });

  // Mock proposal data - replace with actual API calls
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockProposals: Proposal[] = [
          {
            id: '1',
            title: 'Increase Minimum Savings Requirement',
            description: 'Proposal to increase the minimum savings requirement from $10 to $25 to strengthen the SACCO fund and reduce loan default risk.',
            proposer: '0x1234...5678',
            yesVotes: 15,
            noVotes: 3,
            createdAt: new Date('2024-01-20'),
            expiresAt: new Date('2024-01-27'),
            status: 'active',
            hasVoted: false
          },
          {
            id: '2',
            title: 'Add New Loan Category for Education',
            description: 'Create a special loan category for education purposes with reduced interest rates and extended repayment periods.',
            proposer: '0x2345...6789',
            yesVotes: 22,
            noVotes: 1,
            createdAt: new Date('2024-01-15'),
            expiresAt: new Date('2024-01-22'),
            status: 'passed',
            hasVoted: true,
            userVote: true
          },
          {
            id: '3',
            title: 'Monthly SACCO Meetings',
            description: 'Establish mandatory monthly meetings for all SACCO members to discuss financial matters and community issues.',
            proposer: '0x3456...7890',
            yesVotes: 8,
            noVotes: 12,
            createdAt: new Date('2024-01-10'),
            expiresAt: new Date('2024-01-17'),
            status: 'rejected',
            hasVoted: true,
            userVote: false
          }
        ];
        
        // Filter proposals based on the filter prop
        let filteredProposals = mockProposals;
        
        if (filter === 'active') {
          filteredProposals = mockProposals.filter(p => p.status === 'active');
        } else if (filter === 'past' || filter === 'passed') {
          filteredProposals = mockProposals.filter(p => p.status === 'passed');
        } else if (filter === 'rejected') {
          filteredProposals = mockProposals.filter(p => p.status === 'rejected');
        }
        
        setProposals(filteredProposals);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isApprovedMember) {
      fetchProposals();
    }
  }, [isApprovedMember, filter]);

  const handleCreateProposal = async () => {
    if (!proposalForm.title || !proposalForm.description) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const tx = await createProposal({
        args: [proposalForm.title, proposalForm.description],
      });

      toast.success('Proposal created successfully!');
      console.log('Create proposal transaction:', tx);
      
      // Add to local proposals
      const newProposal: Proposal = {
        id: Date.now().toString(),
        title: proposalForm.title,
        description: proposalForm.description,
        proposer: userAddress!,
        yesVotes: 0,
        noVotes: 0,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'active',
        hasVoted: false
      };
      
      setProposals(prev => [newProposal, ...prev]);
      setProposalForm({ title: '', description: '' });
      setShowProposalForm(false);
      
    } catch (error) {
      console.error('Create proposal error:', error);
      toast.error('Failed to create proposal. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (proposalId: string, voteYes: boolean) => {
    try {
      setVotingProposalId(proposalId);
      
      const tx = await vote({
        args: [proposalId, voteYes],
      });

      toast.success(`Vote cast successfully! You voted ${voteYes ? 'YES' : 'NO'}`);
      console.log('Vote transaction:', tx);
      
      // Update local proposal data
      setProposals(prev => prev.map(proposal => 
        proposal.id === proposalId 
          ? { 
              ...proposal, 
              hasVoted: true,
              userVote: voteYes,
              yesVotes: proposal.yesVotes + (voteYes ? 1 : 0),
              noVotes: proposal.noVotes + (voteYes ? 0 : 1)
            }
          : proposal
      ));
      
    } catch (error) {
      console.error('Vote error:', error);
      toast.error('Failed to cast vote. Please try again.');
    } finally {
      setVotingProposalId(null);
    }
  };

  const getStatusColor = (status: Proposal['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'passed': return 'default';
      case 'rejected': return 'destructive';
      case 'expired': return 'secondary';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: Proposal['status']) => {
    switch (status) {
      case 'active': return <Clock className="w-4 h-4" />;
      case 'passed': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'expired': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (!isApprovedMember) {
    return (
      <div className="text-center py-8">
        <Vote className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-600 mb-2">
          Membership Required
        </h2>
        <p className="text-gray-500">
          You need to be an approved member to participate in governance.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Governance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Proposals</CardTitle>
            <Vote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proposals.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting votes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Proposals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proposals.length}
            </div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Passed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {proposals.filter(p => p.status === 'passed').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Successful proposals
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Votes</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {proposals.filter(p => p.hasVoted).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Proposals voted on
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create Proposal */}
      <Card>
        <CardHeader>
          <CardTitle>Create Proposal</CardTitle>
          <CardDescription>
            Submit a new proposal for SACCO members to vote on
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showProposalForm ? (
            <div className="text-center py-8">
              <Button 
                onClick={() => setShowProposalForm(true)}
                size="lg"
                className="min-w-48"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Proposal
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="proposal-title">Proposal Title</Label>
                <Input
                  id="proposal-title"
                  placeholder="Enter a clear, descriptive title"
                  value={proposalForm.title}
                  onChange={(e) => setProposalForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="proposal-description">Description</Label>
                <Textarea
                  id="proposal-description"
                  placeholder="Provide detailed information about your proposal, including rationale and expected impact..."
                  rows={6}
                  value={proposalForm.description}
                  onChange={(e) => setProposalForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={handleCreateProposal}
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
                      <Plus className="w-4 h-4 mr-2" />
                      Submit Proposal
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setShowProposalForm(false)}
                  size="lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Proposals List */}
      <Card>
        <CardHeader>
          <CardTitle>Proposals</CardTitle>
          <CardDescription>
            Vote on active proposals and view proposal history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 border rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : proposals.length === 0 ? (
            <div className="text-center py-8">
              <Vote className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No proposals yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {proposals.map((proposal) => (
                <div key={proposal.id} className="p-6 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(proposal.status)}
                        <h3 className="text-lg font-semibold">{proposal.title}</h3>
                        <Badge variant={getStatusColor(proposal.status)}>
                          {proposal.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{proposal.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                        <div>
                          <span className="font-medium">Proposed by:</span> {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                        </div>
                        <div>
                          <span className="font-medium">Created:</span> {formatDate(proposal.createdAt)}
                        </div>
                        <div>
                          <span className="font-medium">Expires:</span> {formatDate(proposal.expiresAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Vote Results */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ThumbsUp className="w-4 h-4 text-green-600" />
                        <span className="font-medium text-green-700">Yes</span>
                      </div>
                      <span className="text-xl font-bold text-green-600">
                        {proposal.yesVotes}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <ThumbsDown className="w-4 h-4 text-red-600" />
                        <span className="font-medium text-red-700">No</span>
                      </div>
                      <span className="text-xl font-bold text-red-600">
                        {proposal.noVotes}
                      </span>
                    </div>
                  </div>
                  
                  {/* Voting Buttons */}
                  {proposal.status === 'active' && !proposal.hasVoted && (
                    <div className="flex space-x-4">
                      <Button 
                        onClick={() => handleVote(proposal.id, true)}
                        disabled={votingProposalId === proposal.id}
                        variant="default"
                        size="sm"
                      >
                        {votingProposalId === proposal.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <ThumbsUp className="w-4 h-4 mr-2" />
                        )}
                        Vote Yes
                      </Button>
                      <Button 
                        onClick={() => handleVote(proposal.id, false)}
                        disabled={votingProposalId === proposal.id}
                        variant="outline"
                        size="sm"
                      >
                        {votingProposalId === proposal.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <ThumbsDown className="w-4 h-4 mr-2" />
                        )}
                        Vote No
                      </Button>
                    </div>
                  )}
                  
                  {proposal.hasVoted && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>
                        You voted <strong>{proposal.userVote ? 'YES' : 'NO'}</strong> on this proposal
                      </span>
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