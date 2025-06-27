import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get stats from the database
    const [
      activeProposalsCount,
      passedProposalsCount,
      rejectedProposalsCount,
      totalVotesCount
    ] = await Promise.all([
      db.proposal.count({
        where: {
          status: 'ACTIVE'
        }
      }),
      db.proposal.count({
        where: {
          status: 'PASSED'
        }
      }),
      db.proposal.count({
        where: {
          status: 'REJECTED'
        }
      }),
      db.vote.count()
    ]);

    // Calculate participation rate (if there are proposals)
    const totalProposals = activeProposalsCount + passedProposalsCount + rejectedProposalsCount;
    const memberCount = await db.member.count({
      where: {
        isApproved: true
      }
    });
    
    const averageParticipation = memberCount > 0 && totalProposals > 0
      ? (totalVotesCount / (memberCount * totalProposals))
      : 0;

    return NextResponse.json({
      activeProposals: activeProposalsCount,
      passedProposals: passedProposalsCount,
      rejectedProposals: rejectedProposalsCount,
      totalVotes: totalVotesCount,
      memberCount,
      averageParticipation: Math.min(1, averageParticipation) // Cap at 100%
    });
  } catch (error) {
    console.error('Error fetching governance stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch governance statistics' },
      { status: 500 }
    );
  }
}
