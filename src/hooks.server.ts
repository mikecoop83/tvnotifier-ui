import { getUserFromToken } from '$lib/server/auth';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
	if (event.url.pathname.startsWith('/login') || event.url.pathname.startsWith('/callback/google')) {
		const response = await resolve(event);
		return response;
	}

	const token = event.cookies.get('auth');
	if (!token) {
		throw redirect(302, '/login');
	}

	event.locals.user = getUserFromToken(token);

	const response = await resolve(event);
	return response;
}) satisfies Handle;
