import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { checkAdminAccess } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess(req);
    
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status'); // pending, approved, all
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    let whereClause = {};
    if (status === 'pending') {
      whereClause = { isApproved: false };
    } else if (status === 'approved') {
      whereClause = { isApproved: true };
    }

    const [members, totalCount] = await Promise.all([
      db.member.findMany({
        where: whereClause,
        orderBy: {
          membershipDate: 'desc'
        },
        skip,
        take: limit,
        select: {
          id: true,
          walletAddress: true,
          name: true,
          email: true,
          isApproved: true,
          isActive: true,
          role: true,
          membershipDate: true,
          _count: {
            select: {
              savings: true,
              loans: true
            }
          }
        }
      }),
      db.member.count({ where: whereClause })
    ]);

    return NextResponse.json({
      members,
      pagination: {
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        page,
        limit
      }
    });
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const adminCheck = await checkAdminAccess(req);
    
    if (!adminCheck.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { memberId, action } = await req.json();
    
    if (!memberId || !['approve', 'reject', 'activate', 'deactivate', 'makeAdmin', 'removeAdmin'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid request parameters' },
        { status: 400 }
      );
    }
    
    // Update member based on action
    let updateData = {};
    
    switch (action) {
      case 'approve':
        updateData = { isApproved: true };
        break;
      case 'reject':
        updateData = { isApproved: false };
        break; 
      case 'activate':
        updateData = { isActive: true };
        break;
      case 'deactivate':
        updateData = { isActive: false };
        break;
      case 'makeAdmin':
        updateData = { role: 'ADMIN' };
        break;
      case 'removeAdmin':
        updateData = { role: 'MEMBER' };
        break;
    }
    
    const member = await db.member.update({
      where: { id: memberId },
      data: updateData
    });
    
    // Log admin action
    await db.adminLog.create({
      data: {
        action: `MEMBER_${action.toUpperCase()}`,
        details: `Member ID: ${memberId}`,
        adminId: adminCheck.memberId || '',
        ipAddress: req.headers.get('x-forwarded-for') || null
      }
    });
    
    return NextResponse.json({ success: true, member });
  } catch (error) {
    console.error('Error updating member:', error);
    return NextResponse.json(
      { error: 'Failed to update member' },
      { status: 500 }
    );
  }
}
