const DEFAULT_CLIENT_IP = 'unknown';

export function getClientIp(request: Request): string {
  return (
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    DEFAULT_CLIENT_IP
  );
}
