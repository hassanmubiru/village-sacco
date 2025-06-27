import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    // Get stats from the database
    const [
      totalMembers,
      pendingMembers,
      totalLoans,
      activeLoans,
      totalSavings,
      totalTransactions
    ] = await Promise.all([
      db.member.count({
        where: {
          isApproved: true
        }
      }),
      db.member.count({
        where: {
          isApproved: false
        }
      }),
      db.loan.count(),
      db.loan.count({
        where: {
          status: {
            in: ['APPROVED', 'DISBURSED']
          }
        }
      }),
      db.saving.aggregate({
        _sum: {
          amount: true
        }
      }),
      db.transaction.count()
    ]);

    // Calculate total loans amount
    const loanAmounts = await db.loan.aggregate({
      _sum: {
        amount: true
      }
    });

    return NextResponse.json({
      totalMembers,
      pendingMembers,
      totalLoans,
      activeLoans,
      totalSavings: totalSavings._sum.amount || 0,
      totalLoanAmount: loanAmounts._sum.amount || 0,
      totalTransactions
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin statistics' },
      { status: 500 }
    );
  }
}
