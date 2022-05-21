import { RequestOptions } from 'https';

import { mapEntryValue } from './entryConverter';
import { getRequestOptions } from '../microcms_api/request_options';
import { getApiResponse } from '../microcms_api/api_response';
import { BlogApiSchema } from '../microcms_api/api_schema';
import { mapBlogApiSchemaToEntryValueParameter } from '../microcms_api/api_schema_to_entry_value_parameter';
import { EntryValue, EntryValueParameter } from './entryValue';

const LIMIT = 10;

type MicroCmsApiOptions = {
  offset: number;
  limit: number;
};

type EntriesResponse = {
  contents: BlogApiSchema[];
  totalCount: number;
  offset: number;
  limit: number;
};

function getEntryApiRequestOptions(options: MicroCmsApiOptions): RequestOptions {
  return getRequestOptions({
    path: `/${process.env.X_MICROCMS_API_PATH}?limit=${options.limit}&offset=${options.offset}`,
  });
}

async function getEntryTotalCount(): Promise<number> {
  const options = getEntryApiRequestOptions({ limit: 1, offset: 0 });
  const res = await getApiResponse<EntriesResponse>(options);

  return res.totalCount;
}

async function getBlogContents({ offset }: { offset: number }): Promise<BlogApiSchema[]> {
  const options = getEntryApiRequestOptions({ offset, limit: LIMIT });
  const res = await getApiResponse<EntriesResponse>(options);

  return res.contents;
}

export async function buildEntries(): Promise<EntryValue[]> {
  const totalCount = await getEntryTotalCount();

  const resContents: EntryValueParameter[][] = [];
  const maxCount = Math.ceil(totalCount / LIMIT);

  let count = 0;
  while (maxCount >= count) {
    const contents = await getBlogContents({
      offset: LIMIT * count,
    });
    const value = contents.map(mapBlogApiSchemaToEntryValueParameter);
    resContents.push(value);
    count++;
  }

  const flattenResContents = resContents.flat();
  const entryValueList = await Promise.all(flattenResContents.map(mapEntryValue));

  return entryValueList;
}
