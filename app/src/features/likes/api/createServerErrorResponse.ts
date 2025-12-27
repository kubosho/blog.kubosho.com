type ServerErrorType = { error: unknown };

export function createServerErrorResponse(params: ServerErrorType): Response {
  const { error } = params;

  if (error instanceof Error) {
    return new Response(
      JSON.stringify({
        message: error.message,
        details: error.cause ?? null,
      }),
      { status: 500 },
    );
  }

  return new Response(
    JSON.stringify({
      message: 'Internal server error',
      details: null,
    }),
    { status: 500 },
  );
}
