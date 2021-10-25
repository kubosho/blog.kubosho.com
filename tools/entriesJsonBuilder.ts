import { join as pathJoin } from 'path';
import { request, RequestOptions } from 'https';
import { writeFile } from 'fs/promises';
import { config as dotenvConfig } from 'dotenv';

import { mapEntryValue } from '../src/entry/entryConverter';
import { EntryValueParameter } from '../src/entry/entryValue';

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

type ResponseJson = {
  contents: BlogApiSchema[];
  totalCount: number;
  offset: number;
  limit: number;
};

async function getResponseFromMicroCMS(options: RequestOptions): Promise<string | Error> {
  return new Promise((resolve, reject) => {
    const req = request(options, (res) => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return reject(new Error(`Status Code: ${res.statusCode}`));
      }

      const response = [];

      res.on('data', (d) => {
        response.push(d.toString());
      });

      res.on('end', () => resolve(response.join('')));
    });

    req.end();
  });
}

async function getResContents(option: {
  offset: number;
}): Promise<{ contents: BlogApiSchema[]; totalCount: number; offset: number }> {
  const options = {
    hostname: process.env.X_MICROCMS_HOST_NAME,
    port: 443,
    path: `/${process.env.X_MICROCMS_API_PATH}?limit=${LIMIT}&offset=${option.offset}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-MICROCMS-API-KEY': process.env.X_MICROCMS_API_KEY,
    },
  };

  const res = await getResponseFromMicroCMS(options);
  if (res instanceof Error) {
    throw res;
  }

  const resJson: ResponseJson = JSON.parse(res);
  const { contents, totalCount, offset } = resJson;

  return { contents, totalCount, offset };
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
  const { contents, totalCount } = await getResContents({ offset: 0 });

  const resContents = [contents.map(mapBlogApiSchemaToEntryValueParameter)];
  const maxCount = Math.ceil(totalCount / LIMIT);

  let count = 1;
  while (maxCount >= count) {
    const { contents } = await getResContents({
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
