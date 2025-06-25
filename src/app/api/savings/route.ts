
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    memberId: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { memberId } = params;
    
    // Mock data for build verification
    // Replace with actual database queries once Prisma is set up
    const mockSavings = [
      {
        id: '1',
        amount: 500.00,
        date: new Date('2024-01-15'),
        type: 'deposit',
        transactionHash: '0x123...abc'
      },
      {
        id: '2', 
        amount: 250.00,
        date: new Date('2024-01-20'),
        type: 'deposit',
        transactionHash: '0x456...def'
      }
    ];

    return NextResponse.json({
      memberId,
      savings: mockSavings,
      totalSavings: 750.00
    });
  } catch (error) {
    console.error('Error fetching member savings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch member savings' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { memberId } = params;
    const body = await request.json();
    
    // Mock successful deposit
    const mockDeposit = {
      id: Date.now().toString(),
      memberId,
      amount: body.amount,
      date: new Date(),
      type: 'deposit',
      transactionHash: `0x${Math.random().toString(16).slice(2)}`
    };

    return NextResponse.json(mockDeposit, { status: 201 });
  } catch (error) {
    console.error('Error creating savings deposit:', error);
    return NextResponse.json(
      { error: 'Failed to create savings deposit' },
      { status: 500 }
    );
  }
}