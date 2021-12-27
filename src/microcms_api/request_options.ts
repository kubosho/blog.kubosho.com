import { RequestOptions } from 'https';

type Params = {
  path: string;
};

export function getRequestOptions({ path }: Params): RequestOptions {
  return {
    hostname: process.env.X_MICROCMS_HOST_NAME,
    port: 443,
    path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-MICROCMS-API-KEY': process.env.X_MICROCMS_API_KEY,
    },
  };
}
