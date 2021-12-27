import { join as pathJoin } from 'path';
import { RequestOptions } from 'https';
import { writeFile } from 'fs/promises';
import { config as dotenvConfig } from 'dotenv';

import { mapEntryValue } from '../src/entry/entryConverter';
import { EntryValueParameter } from '../src/entry/entryValue';
import { getRequestOptions } from '../src/microcms_api/request_options';
import { getApiResponse } from '../src/microcms_api/api_response';

const BASE_DIR = pathJoin(__dirname, '..');

const OUTPUT_FILE = 'entries.json';
const DESTINATION_FILE = `${BASE_DIR}/${OUTPUT_FILE}`;

const LIMIT = 10;

type BlogApiSchema = {
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

function mapBlogApiSchemaToEntryValueParameter(blogApiSchemaObject: BlogApiSchema): EntryValueParameter {
  return {
    id: blogApiSchemaObject.id,
    title: blogApiSchemaObject.title,
    body: blogApiSchemaObject.body,
    slug: blogApiSchemaObject.slug,
    createdAt: blogApiSchemaObject.createdAt,
    updatedAt: blogApiSchemaObject.updatedAt,
    publishedAt: blogApiSchemaObject.publishedAt,
    revisedAt: blogApiSchemaObject.revisedAt,
    originalCreatedAt: blogApiSchemaObject.originalCreatedAt,
    originalRevisedAt: blogApiSchemaObject.originalRevisedAt,
    excerpt: blogApiSchemaObject.excerpt,
    heroImage: blogApiSchemaObject.heroImage,
    categories: blogApiSchemaObject.categories,
    tags: blogApiSchemaObject.tags,
  };
}

async function main(): Promise<void> {
  const totalCount = await getEntryTotalCount();

  const resContents = [];
  const maxCount = Math.ceil(totalCount / LIMIT);

  let count = 0;
  while (maxCount >= count) {
    const contents = await getBlogContents({
      offset: LIMIT * count,
    });
    resContents.push(contents.map(mapBlogApiSchemaToEntryValueParameter));
    count++;
  }

  const flattenResContents = resContents.flat();
  const entryValueList = await Promise.all(flattenResContents.map(mapEntryValue));

  await writeFile(DESTINATION_FILE, JSON.stringify(entryValueList));
}

dotenvConfig();
main();
