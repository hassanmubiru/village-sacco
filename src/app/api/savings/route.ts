import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock savings data
    const savings = [
      {
        id: '1',
        memberId: 'member1',
        amount: 500.00,
        date: new Date('2024-01-15'),
        type: 'deposit',
        transactionHash: '0x123...abc'
      },
    ];

    return NextResponse.json(savings);
  } catch (error) {
    console.error('Error fetching savings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch savings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock successful deposit
    const newSaving = {
      id: Date.now().toString(),
      memberId: body.memberId,
      amount: body.amount,
      date: new Date(),
      type: 'deposit',
      transactionHash: `0x${Math.random().toString(16).slice(2)}`
    };

    return NextResponse.json(newSaving, { status: 201 });
  } catch (error) {
    console.error('Error creating saving:', error);
    return NextResponse.json(
      { error: 'Failed to create saving' },
      { status: 500 }
    );
  }
}