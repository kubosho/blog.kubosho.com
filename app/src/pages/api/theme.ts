import type { APIContext } from 'astro';

type Theme = 'system' | 'light' | 'dark';

type ThemeRequestBody = {
  theme?: unknown;
};

const KEY = 'theme' as const;
// Unit is seconds. 1 year.
const MAX_AGE = 60 * 60 * 24 * 365;

const VALID_THEMES: Theme[] = ['system', 'light', 'dark'];

function isValidTheme(value: unknown): value is Theme {
  return typeof value === 'string' && VALID_THEMES.includes(value as Theme);
}

export const prerender = false;

export function GET({ cookies }: APIContext): Response {
  const theme = cookies.get(KEY)?.value ?? 'system';
  return new Response(JSON.stringify({ theme }), { status: 200 });
}

export async function POST({ cookies, request }: APIContext): Promise<Response> {
  const body: ThemeRequestBody = await request.json();
  const theme = body.theme;

  if (!isValidTheme(theme)) {
    return new Response(JSON.stringify({ error: 'Invalid theme value' }), { status: 400 });
  }

  const sharedCookieOptions = {
    // httpOnly must be false to allow client-side script to read the cookie for theme application
    httpOnly: false,
    path: '/',
    sameSite: 'strict',
    secure: true,
  } as const;

  if (theme === 'system') {
    cookies.delete(KEY, sharedCookieOptions);
    return new Response(JSON.stringify({ theme: 'system' }), { status: 200 });
  }

  cookies.set(KEY, theme, {
    ...sharedCookieOptions,
    maxAge: MAX_AGE,
  });

  return new Response(JSON.stringify({ theme }), { status: 200 });
}
