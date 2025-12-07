import { buildAuthUrl } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (async ({ url }) => {
	const authUrl = await buildAuthUrl(url.origin);
	throw redirect(302, authUrl);
}) satisfies RequestHandler;
