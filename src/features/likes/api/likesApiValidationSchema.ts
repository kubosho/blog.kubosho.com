import { type InferOutput, integer, minValue, number, object, pipe, string } from 'valibot';

export const likesRequestSchema = object({
  increment: pipe(
    number('Increment must be a number'),
    integer('Increment must be an integer'),
    minValue(1, 'Increment must be at least 1'),
  ),
});

export const likesResponseSchema = object({
  message: string('Message must be a string'),
});

export type LikesResponse = InferOutput<typeof likesResponseSchema>;
