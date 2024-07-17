import type { APIContext } from 'astro';

const KEY = 'analytics_optout_enabled' as const;
// Unit is seconds.
const MAX_AGE = 60 * 60 * 24 * 365;

export const prerender = false;

export async function GET({ cookies }: APIContext): Promise<Response> {
  return new Response(JSON.stringify({ enabled: cookies.has(KEY) }), { status: 200 });
}

export async function POST({ cookies }: APIContext): Promise<Response> {
  const sharedCookieOptions = {
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: true,
  } as const;

  if (cookies.has(KEY)) {
    cookies.delete(KEY, sharedCookieOptions);

    return new Response(null, { status: 204 });
  }

  cookies.set(KEY, 'true', {
    ...sharedCookieOptions,
    maxAge: MAX_AGE,
  });

  return new Response(JSON.stringify({ message: 'Cookie is created.' }), { status: 200 });
}
