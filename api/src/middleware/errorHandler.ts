import type { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { HTTPResponseError } from 'hono/types';

import { sendErrorToSentry } from './sentry';

interface ErrorResponse {
  success: false;
  message: string;
}

const createErrorResponse = (message: string): ErrorResponse => ({
  success: false,
  message,
});

export const errorHandler = async (error: Error | HTTPResponseError, context: Context) => {
  sendErrorToSentry(error, context);

  if (error instanceof HTTPException) {
    console.error('HTTPException:', error);
    return context.json(createErrorResponse(error.message), error.status);
  }

  if (error instanceof Error) {
    console.error('Error:', error);
    return context.json(createErrorResponse('Internal Server Error'), 500);
  }

  console.error('Unknown error:', error);
  return context.json(createErrorResponse('Unknown error occurred'), 500);
};

export const notFoundHandler = (context: Context): Response => {
  console.error('Route not found:', context.req.path);
  return context.json(createErrorResponse('Not Found'), 404);
};
