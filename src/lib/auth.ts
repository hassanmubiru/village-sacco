import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { verifyJWT } from '@/lib/privy';

/**
 * Checks if the request is from an admin user
 */
export async function checkAdminAccess(req: NextRequest) {
  try {
    // Get token from authorization header or cookie
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.cookies.get('auth_token')?.value;
    
    if (!token) {
      return { isAdmin: false, error: 'No authentication token' };
    }
    
    // Verify token and get user data
    const userData = await verifyJWT(token);
    
    if (!userData || !userData.walletAddress) {
      return { isAdmin: false, error: 'Invalid authentication token' };
    }
    
    // Check if user is an admin in the database
    const member = await db.member.findFirst({
      where: {
        walletAddress: userData.walletAddress,
        isApproved: true,
        isActive: true,
        role: { in: ['ADMIN', 'SUPER_ADMIN'] }
      },
      select: {
        id: true,
        role: true
      }
    });
    
    if (!member) {
      return { isAdmin: false, error: 'Not an admin' };
    }
    
    return { 
      isAdmin: true, 
      isSuperAdmin: member.role === 'SUPER_ADMIN',
      memberId: member.id 
    };
  } catch (error) {
    console.error('Error checking admin access:', error);
    return { isAdmin: false, error: 'Authentication error' };
  }
}

/**
 * Checks if the request is from an approved member
 */
export async function checkMemberAccess(req: NextRequest) {
  try {
    // Get token from authorization header or cookie
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') 
      ? authHeader.substring(7) 
      : req.cookies.get('auth_token')?.value;
    
    if (!token) {
      return { isMember: false, error: 'No authentication token' };
    }
    
    // Verify token and get user data
    const userData = await verifyJWT(token);
    
    if (!userData || !userData.walletAddress) {
      return { isMember: false, error: 'Invalid authentication token' };
    }
    
    // Check if user is an approved member in the database
    const member = await db.member.findFirst({
      where: {
        walletAddress: userData.walletAddress,
        isApproved: true,
        isActive: true
      },
      select: {
        id: true,
        role: true
      }
    });
    
    if (!member) {
      return { isMember: false, error: 'Not an approved member' };
    }
    
    return { 
      isMember: true, 
      isAdmin: ['ADMIN', 'SUPER_ADMIN'].includes(member.role),
      memberId: member.id 
    };
  } catch (error) {
    console.error('Error checking member access:', error);
    return { isMember: false, error: 'Authentication error' };
  }
}
