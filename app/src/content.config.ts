import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';

const ARTICLES_DIR = process.env.ARTICLES_DIR ?? '../articles';

const entries = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: ARTICLES_DIR }),
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
