import { unwrapMaybe } from 'option-t/lib/Maybe/unwrap';
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
    const c = unwrapMaybe(param.publishedAt || param.createdAt);
    const u = unwrapMaybe(param.revisedAt || param.updatedAt);

    const publishedAt = convertISOStringToMilliseconds(c);
    const revisedAt = convertISOStringToMilliseconds(u);

    this.id = unwrapMaybe(param.id);
    this.slug = unwrapMaybe(param.slug || param.id);
    this.title = unwrapMaybe(param.title);
    this.body = unwrapMaybe(param.body);
    this.excerpt = param.excerpt ?? null;
    this.heroImage = param.heroImage ?? null;
    this.categories = param.categories ?? null;
    this.tags = param.tags ?? null;
    this.publishedAt = publishedAt;
    this.revisedAt = revisedAt;
  }
}
