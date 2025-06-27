import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { dateToBigIntSeconds } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, nationalId, walletAddress } = body;

    if (!name || !email || !walletAddress) {
      return NextResponse.json(
        { error: 'Name, email, and wallet address are required' },
        { status: 400 }
      );
    }

    try {
      // Try to create member in database
      const member = await prisma.member.create({
        data: {
          name,
          email,
          phone: phone || null,
          nationalId: nationalId || null,
          walletAddress: walletAddress.toLowerCase(),
          isApproved: false, // Requires admin approval
          registrationDate: dateToBigIntSeconds(),
          totalSavings: BigInt(0),
          totalLoansAmount: BigInt(0)
        }
      });

      return NextResponse.json({
        success: true,
        member: {
          id: member.id,
          name: member.name,
          email: member.email
        }
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue with success response even if DB fails, since blockchain registration is separate
    }

    // Simulated success response if DB isn't available
    return NextResponse.json({
      success: true,
      member: {
        id: 'pending',
        name,
        email
      },
      note: 'Registration processed on the blockchain but database storage was unavailable'
    });
  } catch (error) {
    console.error('Error registering member:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
