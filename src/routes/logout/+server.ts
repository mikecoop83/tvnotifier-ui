import { redirect, type RequestHandler } from '@sveltejs/kit';

export const POST = (async ({ cookies }) => {
	cookies.delete('auth', { path: '/' });
	throw redirect(302, '/login');
}) satisfies RequestHandler;

export const GET = POST;
