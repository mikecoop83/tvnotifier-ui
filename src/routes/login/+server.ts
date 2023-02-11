import { authUrl } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET = (() => {
	throw redirect(302, authUrl);
}) satisfies RequestHandler;
