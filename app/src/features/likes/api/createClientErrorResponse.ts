type ClientErrorType =
  | { type: 'invalidEntryId' }
  | { type: 'invalidRequestBody' }
  | { type: 'validationError'; error: { issues: Array<{ message: string }> } }
  | { type: 'invalidIncrement' }
  | { type: 'rateLimit'; cooldownSeconds: number };

export function createClientErrorResponse(params: ClientErrorType): Response {
  switch (params.type) {
    case 'invalidEntryId': {
      return new Response(
        JSON.stringify({
          message: 'Invalid Entry ID',
          details: null,
        }),
        { status: 400 },
      );
    }

    case 'invalidRequestBody': {
      return new Response(
        JSON.stringify({
          message: 'Request body must be valid JSON format',
        }),
        { status: 400 },
      );
    }

    case 'validationError': {
      const messages = params.error.issues.map((issue) => issue.message).join(', ');
      return new Response(
        JSON.stringify({
          message: `Validation error: ${messages}`,
        }),
        { status: 400 },
      );
    }

    case 'invalidIncrement': {
      return new Response(
        JSON.stringify({
          message: 'Increment must be positive value',
        }),
        { status: 400 },
      );
    }

    case 'rateLimit': {
      return new Response(
        JSON.stringify({
          message: 'Too Many Requests',
          details: `Rate limit exceeded. Please try again in ${params.cooldownSeconds} seconds.`,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': params.cooldownSeconds.toString(),
          },
        },
      );
    }
  }
}
