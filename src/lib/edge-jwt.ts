// Simple JWT decoder that works in Edge Runtime
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
}

export function decodeJWT(token: string): JWTPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decoded = atob(paddedPayload);
    const parsed = JSON.parse(decoded);
    
    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    if (parsed.exp && parsed.exp < now) {
      return null;
    }
    
    return parsed;
  } catch (error) {
    return null;
  }
}

export function validateJWTStructure(payload: any): payload is JWTPayload {
  return payload &&
         typeof payload.userId === 'string' &&
         typeof payload.email === 'string' &&
         typeof payload.role === 'string' &&
         typeof payload.name === 'string' &&
         typeof payload.iat === 'number' &&
         typeof payload.exp === 'number';
}
