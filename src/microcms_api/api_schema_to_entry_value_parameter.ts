import { EntryValueParameter } from '../entry/entry_value';
import { BlogApiSchema } from './api_schema';

export function mapBlogApiSchemaToEntryValueParameter(blogApiSchemaObject: BlogApiSchema): EntryValueParameter {
  return {
    id: blogApiSchemaObject.id,
    title: blogApiSchemaObject.title,
    body: blogApiSchemaObject.body,
    slug: blogApiSchemaObject.slug,
    createdAt: blogApiSchemaObject.createdAt,
    updatedAt: blogApiSchemaObject.updatedAt,
    publishedAt: blogApiSchemaObject.publishedAt,
    revisedAt: blogApiSchemaObject.revisedAt,
    excerpt: blogApiSchemaObject.excerpt,
    heroImage: blogApiSchemaObject.heroImage,
    categories: blogApiSchemaObject.categories,
    tags: blogApiSchemaObject.tags,
  };
}
