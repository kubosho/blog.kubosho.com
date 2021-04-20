import { unwrapMaybe } from 'option-t/lib/Maybe/unwrap';
import { unwrapOrFromUndefinable } from 'option-t/lib/Undefinable/unwrapOr';

import { convertISOStringToMilliseconds } from './date';

export interface EntryFileAttributes {
  title: string;
  created_at?: Date;
  updated_at?: Date;
  categories?: string;
  tags?: string;
}

export interface MarkdownFileData {
  filename: string;
  title?: string;
  body: string;
  created_at?: string;
  updated_at?: string;
  categories?: string;
  tags?: string;
}

export interface EntryValueParameter {
  body: string;
  excerpt: string;
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  categories?: string[];
  tags?: string[];
}

export class EntryValue {
  readonly body: string;
  readonly excerpt: string;
  readonly id: string;
  readonly title: string;
  readonly categories: string[];
  readonly tags: string[];
  readonly createdAt: number;
  readonly updatedAt: number;

  constructor(param: EntryValueParameter) {
    const c = unwrapMaybe(param.createdAt);
    const u = unwrapMaybe(param.updatedAt);

    const createdAt = convertISOStringToMilliseconds(c);
    const updatedAt = convertISOStringToMilliseconds(u);

    this.body = unwrapMaybe(param.body);
    this.excerpt = unwrapMaybe(param.excerpt);
    this.id = unwrapMaybe(param.id);
    this.title = unwrapMaybe(param.title);
    this.categories = unwrapOrFromUndefinable(param.categories, []);
    this.tags = unwrapMaybe(param.tags);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
