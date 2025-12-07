import { createOAuthClient, generateToken } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { error, redirect } from '@sveltejs/kit';
import type { oauth2_v2 } from 'googleapis';
import type { RequestHandler } from './$types';

export const GET = (async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	if (code) {
		const oauth2client = await createOAuthClient(url.origin);
		console.log('[http] request', {
			url: 'https://oauth2.googleapis.com/token',
			method: 'POST',
			scope: 'google-oauth-token'
		});
		const { tokens, res: tokenResponse } = await oauth2client.getToken(code);
		console.log('[http] response', {
			url: 'https://oauth2.googleapis.com/token',
			status: tokenResponse?.status,
			method: 'POST',
			scope: 'google-oauth-token'
		});
		oauth2client.setCredentials(tokens);
		const { data: profileData, status } = await oauth2client.request<oauth2_v2.Schema$Userinfo>({
			url: 'https://www.googleapis.com/oauth2/v1/userinfo',
			method: 'GET'
		});
		console.log('[http] response', {
			url: 'https://www.googleapis.com/oauth2/v1/userinfo',
			status,
			method: 'GET',
			scope: 'google-userinfo'
		});

		if (!profileData.id) {
			throw error(400, 'no profile data');
		}

		const dbUser = await prisma.user.findUnique({
			where: { id: profileData.id }
		});
		if (!dbUser) {
			throw redirect(302, '/denied');
		}

		const token = generateToken(profileData.id, profileData.picture);
		cookies.set('auth', token, { path: '/' });
		throw redirect(302, '/');
	}
	throw error(400, 'how did you even get her bro');
}) satisfies RequestHandler;
