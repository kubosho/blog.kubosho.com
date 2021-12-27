export type BlogApiSchema = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  body: string;
  slug: string;
  categories: string[];
  tags: string[];
  excerpt?: string;
  heroImage?: string;
  originalCreatedAt?: number;
  originalRevisedAt?: number;
};
