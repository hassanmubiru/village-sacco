import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock loans data
    const loans = [
      {
        id: '1',
        memberId: 'member1',
        amount: 1000.00,
        interestRate: 5,
        duration: 12,
        purpose: 'Business expansion',
        status: 'pending',
        appliedAt: new Date('2024-01-20'),
      },
    ];

    return NextResponse.json(loans);
  } catch (error) {
    console.error('Error fetching loans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch loans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock successful loan application
    const newLoan = {
      id: Date.now().toString(),
      memberId: body.memberId,
      amount: body.amount,
      interestRate: body.interestRate || 5,
      duration: body.duration,
      purpose: body.purpose,
      status: 'pending',
      appliedAt: new Date(),
    };

    return NextResponse.json(newLoan, { status: 201 });
  } catch (error) {
    console.error('Error creating loan:', error);
    return NextResponse.json(
      { error: 'Failed to create loan' },
      { status: 500 }
    );
  }
}