import { Factory } from 'fishery';

import type { TinyCollectionEntry } from '../tinyCollectionEntry';

export const collectionEntryFactory = Factory.define<TinyCollectionEntry>(({ sequence }) => ({
  body: `# Entry ${sequence}\n\nThis is the body of entry ${sequence}.`,
  collection: 'entries',
  data: {
    publishedAt: new Date(),
    title: `Entry ${sequence}`,
  },
  id: 'why-focus-on-improving-accessibility.md',
  slug: 'why-focus-on-improving-accessibility',
}));
