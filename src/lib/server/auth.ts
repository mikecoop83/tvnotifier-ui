import { google } from 'googleapis';
import jwt from 'jsonwebtoken';
import base64url from 'base64url';
import { env } from '$env/dynamic/private';
import type { User } from '$lib/types';

const privateKey = env.JWT_KEY;

export const oauth2client = new google.auth.OAuth2(
  env.GOOGLE_CLIENT_ID,
  env.GOOGLE_CLIENT_SECRET,
  new URL('/callback/google', env.SITE_URL).toString()
);

export const authUrl = oauth2client.generateAuthUrl({
  scope: ['openid', 'https://www.googleapis.com/auth/userinfo.profile']
});

// create and store authTokens
// seperate tokens for each client vs one token served to each?
// invalidate tokens based on how long it's been since theyve been used

export function generateToken(
  userId: string,
  pictureURL?: string | null,
  time: string | number = '6h'
) {
  return jwt.sign({ userId, pictureURL }, privateKey, { algorithm: 'RS256', expiresIn: time });
}

export function getUserFromToken(token: string): User | null {
  try {
    const tokenPayload = <jwt.JwtPayload>jwt.verify(token, privateKey, { algorithms: ['RS256'] });
    return (tokenPayload as User) || null;
  } catch (e) {
    return null;
  }
}

export function generateSignupHash(userId: string) {
  return base64url.encode(JSON.stringify({ userId, time: Date.now() }));
}

export function decryptSignupHash(hash: string) {
  try {
    const decoded = base64url.decode(hash);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
