import {jwtDecode} from 'jwt-decode';

interface DecodedToken {
  id: string;
  admin: boolean;
  courses: Array<{ type: string; _id: string }>;
  exp: number;
  iat: number;
  nbf: number;
}

export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

export const isTokenExpired = (token: string, bufferMinutes: number = 5): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const bufferSeconds = bufferMinutes * 60;
    
    return currentTime + bufferSeconds >= decoded.exp;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

export const getTokenTimeRemaining = (token: string): number => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return 0;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const remaining = decoded.exp - currentTime;
    
    return remaining > 0 ? remaining : 0;
  } catch (error) {
    console.error('Error getting token time remaining:', error);
    return 0;
  }
};

export const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  
  try {
    const decoded = decodeToken(token);
    if (!decoded) return false;
    
    return !isTokenExpired(token);
  } catch (error) {
    return false;
  }
};