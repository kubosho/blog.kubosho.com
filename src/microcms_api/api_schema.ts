import { HeroImage } from './hero_image';

export type BlogApiSchema = {
  id: string;
  title: string;
  body: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  categories: string[] | undefined;
  tags: string[] | undefined;
  excerpt: string | undefined;
  heroImage: HeroImage | undefined;
};
