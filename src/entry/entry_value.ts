import { BlogApiSchema } from '../microcms_api/api_schema';
import { HeroImage } from '../microcms_api/hero_image';

import { convertISOStringToMilliseconds } from './date';

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

  constructor(param: BlogApiSchema) {
    const c = param.publishedAt ?? param.createdAt;
    const u = param.revisedAt ?? param.updatedAt;

    const publishedAt = convertISOStringToMilliseconds(c);
    const revisedAt = convertISOStringToMilliseconds(u);

    this.id = param.id;
    this.slug = param.slug ?? param.id;
    this.title = param.title;
    this.body = param.body;
    this.excerpt = param.excerpt ?? null;
    this.heroImage = param.heroImage ?? null;
    this.categories = param.categories ?? null;
    this.tags = param.tags ?? null;
    this.publishedAt = publishedAt;
    this.revisedAt = revisedAt;
  }
}
