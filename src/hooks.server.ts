import { getUserFromToken } from '$lib/server/auth';
import { prisma } from '$lib/server/prisma';
import { redirect, type Handle } from '@sveltejs/kit';

export const handle = (async ({ event, resolve }) => {
  if (
    event.url.pathname.startsWith('/login') ||
    event.url.pathname.startsWith('/callback/google')
  ) {
    const response = await resolve(event);
    return response;
  }

  const token = event.cookies.get('auth');
  if (!token) {
    throw redirect(302, '/login');
  }

  const user = getUserFromToken(token);
  if (!user) {
    throw redirect(302, '/login');
  }
  console.log(user);

  event.locals.user = user;
  const dbUser = await prisma.user.findUnique({
    where: {
      id: user.userId
    }
  });
  if (!dbUser) {
    throw redirect(302, '/login');
  }

  const response = await resolve(event);
  return response;
}) satisfies Handle;
