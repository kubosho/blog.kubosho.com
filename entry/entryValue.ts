import { unwrapMaybe } from 'option-t/lib/Maybe/unwrap';
import { unwrapOrFromUndefinable } from 'option-t/lib/Undefinable/unwrapOr';

import { convertISOStringToDateTime } from './date';

export interface ContentfulCustomEntryFields {
  content: string;
  excerpt: string;
  slug: string;
  categories: Array<string>;
  tags: Array<string>;
  title: string;
  publishedAt?: string;
}

export interface EntryValueParameter {
  content: string;
  excerpt: string;
  id: string;
  slug: string;
  title: string;
  categories: Array<string>;
  tags: Array<string>;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

export class EntryValue {
  readonly content: string;
  readonly excerpt: string;
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly categories: Array<string>;
  readonly tags: Array<string>;
  readonly createdAt: number;
  readonly updatedAt: number;

  constructor(param: EntryValueParameter) {
    const c = unwrapOrFromUndefinable(param.publishedAt, param.createdAt);
    const u = unwrapMaybe(param.updatedAt);

    const createdAt = convertISOStringToDateTime(c).toMillis();
    const updatedAt = convertISOStringToDateTime(u).toMillis();

    this.content = unwrapMaybe(param.content);
    this.excerpt = unwrapMaybe(param.excerpt);
    this.id = unwrapMaybe(param.id);
    this.slug = unwrapMaybe(param.slug);
    this.title = unwrapMaybe(param.title);
    this.categories = unwrapMaybe(param.categories);
    this.tags = unwrapMaybe(param.tags);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
