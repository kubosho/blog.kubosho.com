import { wrapRequestHandler } from '@sentry/cloudflare';
import { defineMiddleware } from 'astro/middleware';
import { env as cloudflareEnv } from 'cloudflare:workers';

const parseTracesSampleRate = (value: string | undefined): number | undefined => {
  if (value == null) {
    return undefined;
  }

  const sampleRate = Number.parseFloat(value);
  return Number.isFinite(sampleRate) ? sampleRate : undefined;
};

export const onRequest = defineMiddleware((context, next) => {
  const cfContext = context.locals.cfContext;
  if (cfContext == null) {
    return next();
  }

  return wrapRequestHandler(
    {
      options: {
        dsn: cloudflareEnv.SENTRY_DSN ?? cloudflareEnv.PUBLIC_SENTRY_DSN,
        environment: cloudflareEnv.SENTRY_ENVIRONMENT ?? cloudflareEnv.CLOUDFLARE_ENV,
        tracesSampleRate: parseTracesSampleRate(cloudflareEnv.SENTRY_TRACES_SAMPLE_RATE) ?? 1,
      },
      request: context.request,
      context: cfContext,
    },
    () => next(),
  );
});
