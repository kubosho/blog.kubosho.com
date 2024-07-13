// This next line the lint error is false positive
// eslint-disable-next-line import/no-unresolved
import { defineCollection, z } from 'astro:content';

const entries = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    publishedAt: z.date(),
    revisedAt: z.date().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    heroImageUrl: z.string().optional(),
    ogImageUrl: z.string().optional(),
  }),
});

export const collections = { entries };
