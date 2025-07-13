import { integer, maxValue, minValue, number, object, pipe } from 'valibot';

export const addLikesSchema = object({
  counts: pipe(
    number('Counts must be a number'),
    integer('Counts must be an integer'),
    minValue(1, 'Counts must be at least 1'),
    maxValue(100, 'Counts must not exceed 100'),
  ),
});
