import type { RequestOptions } from 'https';

type Params = {
  apiPath?: string;
  query?: string;
};

export function getRequestOptions({ apiPath = '', query = '' }: Params): RequestOptions {
  const subDomain = import.meta.env.X_MICROCMS_API_SUB_DOMAIN;
  const apiName = import.meta.env.X_MICROCMS_API_NAME;
  const apiKey = import.meta.env.X_MICROCMS_API_KEY;

  const hostname = `${subDomain}.microcms.io`;
  const apiVersion = '/api/v1';
  const entryPoint = `/${apiName}`;
  const path = `${apiVersion}${entryPoint}${apiPath}${query}`;

  return {
    hostname,
    port: 443,
    path,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-MICROCMS-API-KEY': apiKey,
    },
  };
}
