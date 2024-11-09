import type { CollectionEntry } from 'astro:content';

export type TinyCollectionEntry = Omit<CollectionEntry<'entries'>, 'render'>;
