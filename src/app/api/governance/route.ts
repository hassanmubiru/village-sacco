import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock proposals data
    const proposals = [
      {
        id: '1',
        title: 'Increase Minimum Savings',
        description: 'Proposal to increase minimum savings requirement',
        proposer: '0x1234...5678',
        yesVotes: 15,
        noVotes: 3,
        status: 'active',
        createdAt: new Date('2024-01-20'),
        expiresAt: new Date('2024-01-27'),
      },
    ];

    return NextResponse.json(proposals);
  } catch (error) {
    console.error('Error fetching proposals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch proposals' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock successful proposal creation
    const newProposal = {
      id: Date.now().toString(),
      title: body.title,
      description: body.description,
      proposer: body.proposer,
      yesVotes: 0,
      noVotes: 0,
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    return NextResponse.json(newProposal, { status: 201 });
  } catch (error) {
    console.error('Error creating proposal:', error);
    return NextResponse.json(
      { error: 'Failed to create proposal' },
      { status: 500 }
    );
  }
}