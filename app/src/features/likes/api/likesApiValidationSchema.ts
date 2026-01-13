import { type InferOutput, integer, maxValue, minValue, number, object, pipe, string } from 'valibot';

export const MAX_INCREMENT_VALUE = 100;

export const likesOnGetResponseSchema = object({
  id: pipe(string()),
  counts: pipe(number(), integer(), minValue(0, 'Counts must be at least 0')),
});

export const likesOnPostRequestSchema = object({
  increment: pipe(
    number(),
    integer(),
    minValue(1, 'Increment must be at least 1'),
    maxValue(MAX_INCREMENT_VALUE, `Increment must be at most ${MAX_INCREMENT_VALUE}`),
  ),
});

export const likesOnPostResponseSchema = object({
  message: string(),
});

export type LikesOnGetResponse = InferOutput<typeof likesOnGetResponseSchema>;
export type LikesOnPostResponse = InferOutput<typeof likesOnPostResponseSchema>;
