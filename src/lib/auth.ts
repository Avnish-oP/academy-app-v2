import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthUser {
  userId: string;
  username: string;
  email: string;
  role: string;
  name: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  error?: string;
}

export async function verifyToken(request: NextRequest): Promise<AuthResult> {
  try {
    // Try to get token from cookie first, then from Authorization header
    let token = request.cookies.get('token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return { success: false, error: 'No token provided' };
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    
    return { success: true, user: decoded };

  } catch (error) {
    return { success: false, error: 'Invalid token' };
  }
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
}
