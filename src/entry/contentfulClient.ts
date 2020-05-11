import { ContentfulClientApi, createClient } from 'contentful';

export function createContentfulClient(space: string, accessToken: string): ContentfulClientApi {
  const c = createClient({
    space,
    accessToken,
  });

  return c;
}
