import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const entries = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: '../articles' }),
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
