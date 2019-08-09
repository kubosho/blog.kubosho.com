import { Sys } from 'contentful';
import { default as marked } from 'marked';
import { unwrapOrFromUndefinable } from 'option-t/lib/Undefinable/unwrapOr';

import { ContentfulCustomEntryFields, EntryValueParameter, EntryValue } from './entryValue';

export function mapEntryValueParameter(sys: Sys, fields: ContentfulCustomEntryFields): EntryValueParameter {
  const content = marked(fields.content);
  const excerpt = createExcerptText(fields);

  const res: EntryValueParameter = {
    ...sys,
    ...fields,
    content,
    excerpt,
  };

  return res;
}

export function createEntryValue(param: EntryValueParameter): EntryValue {
  const v = new EntryValue(param);
  return v;
}

function createExcerptText(fields: ContentfulCustomEntryFields): string {
  const excerpt = fields.excerpt;
  const contentExcerpt = stripParagraphElement(marked(fields.content.split('\n')[0]));

  const r = unwrapOrFromUndefinable(excerpt, contentExcerpt);
  return r;
}

function stripParagraphElement(content: string): string {
  return content.replace(/<\/?p>/g, '');
}
