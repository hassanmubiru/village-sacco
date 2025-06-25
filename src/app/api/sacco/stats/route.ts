import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data for build verification
    // Replace with actual database queries once Prisma is set up
    const stats = {
      totalMembers: 25,
      totalSavings: 15750.50,
      totalLoans: 8900.00,
      activeProposals: 3,
      contractBalance: 24650.50,
      pendingMembers: 5,
      approvedLoans: 12,
      completedLoans: 8
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching SACCO stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SACCO statistics' },
      { status: 500 }
    );
  }
}
