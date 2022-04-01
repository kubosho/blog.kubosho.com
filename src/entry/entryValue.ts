import { unwrapMaybe } from 'option-t/lib/Maybe/unwrap';
import { HeroImage } from '../microcms_api/hero_image';

import { convertISOStringToMilliseconds } from './date';

export interface EntryValueParameter {
  id: string;
  title: string;
  body: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  originalCreatedAt?: number;
  originalRevisedAt?: number;
  excerpt?: string;
  heroImage?: HeroImage;
  categories?: string[];
  tags?: string[];
}

export class EntryValue {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly body: string;
  readonly publishedAt: number;
  readonly revisedAt: number;
  readonly excerpt?: string;
  readonly heroImage?: HeroImage;
  readonly categories?: string[];
  readonly tags?: string[];

  constructor(param: EntryValueParameter) {
    const c = unwrapMaybe(param.publishedAt || param.createdAt);
    const u = unwrapMaybe(param.revisedAt || param.updatedAt);

    const publishedAt = param.originalCreatedAt || convertISOStringToMilliseconds(c);
    const revisedAt = param.originalRevisedAt || convertISOStringToMilliseconds(u);

    this.id = param.id;
    this.slug = unwrapMaybe(param.slug || param.id);
    this.title = unwrapMaybe(param.title);
    this.body = unwrapMaybe(param.body);
    this.excerpt = param.excerpt;
    this.heroImage = param.heroImage;
    this.categories = param.categories;
    this.tags = param.tags;
    this.publishedAt = publishedAt;
    this.revisedAt = revisedAt;
  }
}
