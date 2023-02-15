import { generateToken, getUserFromToken, oauth2client } from '$lib/server/auth';
import { error, redirect } from '@sveltejs/kit';
import type { oauth2_v2 } from 'googleapis';
import type { RequestHandler } from './$types';

export const GET = (async ({ url, cookies }) => {
  const code = url.searchParams.get('code');
  if (code) {
    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);
    const { data: profileData } = await oauth2client.request<oauth2_v2.Schema$Userinfo>({
      url: 'https://www.googleapis.com/oauth2/v1/userinfo',
      method: 'GET'
    });

    if (!profileData.id) {
      throw error(400, 'no profile data');
    }

    const token = generateToken(profileData.id, profileData.picture);
    cookies.set('auth', token, { path: '/' });
    throw redirect(302, '/');
  }
  throw error(400, 'how did you even get her bro');
}) satisfies RequestHandler;
