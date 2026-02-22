import type { GetStaticPaths, InferGetStaticPropsType } from 'astro';
import { getCollection } from 'astro:content';

import { AUTHOR } from '../../../constants/siteData';
import { formatYYMMDDString } from '../../features/entry/date';

export const getStaticPaths = (async () => {
  const entries = await getCollection('entries');

  return entries.map((entry) => ({
    params: { id: entry.id },
    props: { entry },
  }));
}) satisfies GetStaticPaths;

type Props = InferGetStaticPropsType<typeof getStaticPaths>;

const dateSeparator = { year: '-', month: '-', day: '' };

function buildMarkdown(props: Props): string {
  const { entry } = props;
  const { body } = entry;
  const { title, publishedAt, revisedAt, tags = [] } = entry.data;

  const frontmatterLines = ['---', `title: "${title}"`, `published: ${formatYYMMDDString(publishedAt, dateSeparator)}`];

  if (revisedAt != null) {
    frontmatterLines.push(`revised: ${formatYYMMDDString(revisedAt, dateSeparator)}`);
  }

  if (tags.length > 0) {
    frontmatterLines.push(`tags: [${tags.join(', ')}]`);
  }

  frontmatterLines.push(`author: ${AUTHOR}`, '---');

  const frontmatter = frontmatterLines.join('\n');

  return `${frontmatter}\n\n# ${title}\n\n${body ?? ''}`;
}

export function GET(context: { props: Props }): Response {
  const markdown = buildMarkdown(context.props);

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
