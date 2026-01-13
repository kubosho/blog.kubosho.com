export type GetEntryFn = (collection: 'entries', id: string) => Promise<unknown>;

/**
 * Checks if an entry exists in the content collection.
 * Uses getEntry() for O(1) lookup instead of loading all entries.
 * @throws Error if the collection lookup fails (system error)
 */
export async function entryExists(entryId: string, getEntryFn: GetEntryFn): Promise<boolean> {
  const entry = await getEntryFn('entries', entryId);
  return entry !== undefined;
}
