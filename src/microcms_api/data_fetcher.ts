import type { RequestOptions } from 'https';

import type { EntryValue } from '../entry/entry_value';
import { mapEntryValue } from '../entry/entry_converter';

import type { BlogApiSchema } from './api_schema';
import { getRequestOptions } from './request_options';
import { getApiResponse } from './api_response';

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
    query: `?limit=${options.limit}&offset=${options.offset}`,
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

export async function fetchEntries(): Promise<EntryValue[]> {
  const totalCount = await getEntryTotalCount();
  const maxCount = Math.ceil(totalCount / LIMIT);

  let resContents: BlogApiSchema[] = [];
  let count = 0;

  while (maxCount >= count) {
    const contents = await getBlogContents({
      offset: LIMIT * count,
    });
    resContents = resContents.concat(contents);
    count++;
  }

  const entryValueList = await Promise.all(resContents.map(mapEntryValue));

  return entryValueList;
}
