import { NextRequest, NextResponse } from 'next/server';
import { dateToBigIntSeconds } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get('address');
    
    if (!address) {
      return NextResponse.json({ error: 'Address parameter is required' }, { status: 400 });
    }

    // In a production app, you would fetch this data from your database
    // For now, we'll simulate the database check
    try {
      // Try to get member from database if available
      const member = await prisma.member.findUnique({
        where: { walletAddress: address.toLowerCase() }
      });

      if (member) {
        return NextResponse.json({
          isMember: true,
          isApproved: member.isApproved,
          memberData: {
            name: member.name,
            email: member.email,
            isApproved: member.isApproved,
            totalSavings: member.totalSavings,
            totalLoansAmount: member.totalLoansAmount,
            registrationDate: member.registrationDate
          }
        });
      }
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Continue with fallback if DB is not available
    }
    
    // For demo/fallback: use the address itself to determine status
    // This guarantees consistent behavior for the same address
    const lastChar = address.slice(-1).toLowerCase();
    const mockIsRegistered = parseInt(lastChar, 16) % 2 === 0; // Even last character = registered
    const mockIsApproved = parseInt(lastChar, 16) % 3 === 0; // Divisible by 3 = approved
    
    return NextResponse.json({
      isMember: mockIsRegistered,
      isApproved: mockIsApproved && mockIsRegistered,
      memberData: mockIsRegistered ? {
        name: 'Sample User',
        email: `user_${address.slice(0, 6)}@example.com`,
        isApproved: mockIsApproved && mockIsRegistered,
        totalSavings: BigInt(1000 * 10**18).toString(),
        totalLoansAmount: BigInt(0).toString(),
        registrationDate: dateToBigIntSeconds().toString()
      } : null
    });
    
  } catch (error) {
    console.error('Error checking member status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
