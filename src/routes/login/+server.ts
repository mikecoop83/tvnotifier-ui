import { buildAuthUrl } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (({ url }) => {
	const authUrl = buildAuthUrl(url.origin);
	throw redirect(302, authUrl);
}) satisfies RequestHandler;
