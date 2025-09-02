import { type InferOutput, integer, minValue, number, object, pipe, string } from 'valibot';

export const likesRequestSchema = object({
  counts: pipe(
    number('Counts must be a number'),
    integer('Counts must be an integer'),
    minValue(1, 'Counts must be at least 1'),
  ),
});

export const likesResponseSchema = object({
  id: string('ID must be a string'),
  counts: pipe(
    number('Counts must be a number'),
    integer('Counts must be an integer'),
    minValue(1, 'Counts must be at least 1'),
  ),
});

export type LikesResponse = InferOutput<typeof likesResponseSchema>;
