import { getCollection } from 'astro:content';

/**
 * Checks if an entry exists in the content collection.
 * This performs an async lookup against the entries collection.
 */
export async function entryExists(entryId: string): Promise<boolean> {
  try {
    const entries = await getCollection('entries');
    return entries.some((entry) => entry.id === entryId);
  } catch (error) {
    console.error('Failed to check entry existence:', error);
    // If collection lookup fails, return false to be safe
    return false;
  }
}
