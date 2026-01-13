import { maxLength, minLength, pipe, regex, safeParse, string } from 'valibot';

const MAX_ENTRY_ID_LENGTH = 50;

// Entry ID format: lowercase letters, numbers, and hyphens only
// Must start and end with alphanumeric character
// Length: 1-50 characters
const entryIdSchema = pipe(
  string(),
  minLength(1, 'Entry ID is required'),
  maxLength(MAX_ENTRY_ID_LENGTH, `Entry ID must be at most ${MAX_ENTRY_ID_LENGTH} characters`),
  regex(
    /^[a-z0-9][a-z0-9-]*[a-z0-9]$|^[a-z0-9]$/,
    'Entry ID must contain only lowercase letters, numbers, and hyphens, and must start and end with alphanumeric characters',
  ),
);

/**
 * Validates the format of an entry ID.
 * Entry IDs must:
 * - Contain only lowercase letters, numbers, and hyphens
 * - Start and end with alphanumeric characters
 * - Be between 1 and 50 characters
 */
export function isValidEntryIdFormat(id: string | undefined): id is string {
  if (id == null) {
    return false;
  }

  const result = safeParse(entryIdSchema, id);
  return result.success;
}
