import type { PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	cookies.delete('auth', { path: '/' });
	return {};
}) satisfies PageServerLoad;
