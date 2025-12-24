import { boolean, object } from 'valibot';

export const optoutResponseSchema = object({
  enabled: boolean('Enabled must be a boolean'),
});
