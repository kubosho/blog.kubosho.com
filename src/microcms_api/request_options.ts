import { RequestOptions } from 'https';

type Params = {
  apiPath?: string;
  query?: string;
};

export function getRequestOptions({ apiPath = '', query = '' }: Params): RequestOptions {
  const hostname = `${process.env.X_MICROCMS_SUB_DOMAIN}.microcms.io`;
  const apiVersion = '/api/v1';
  const entryPoint = `/${process.env.X_MICROCMS_API_NAME}`;
  const path = `${apiVersion}${entryPoint}${apiPath}${query}`;

  return {
    hostname,
    port: 443,
    path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-MICROCMS-API-KEY': process.env.X_MICROCMS_API_KEY,
    },
  };
}
