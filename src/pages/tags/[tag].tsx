import { GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { EntryValue } from '../../entry/entry_value';
import { EntryList } from '../../components/EntryList';
import { addSiteTitleToSuffix } from '../../site_title_inserter';
import { getEntryListByTag, getTagIdList } from '../../entry/entry_gateway';
import { retrieveTranslation } from '../../locales/i18n';
import { SITE_URL } from '../../constants/site_data';
import { pathList } from '../../constants/path_list';

interface Props {
  filteredEntries: Array<EntryValue>;
  tag: string;
}

export const TagPage = (props: Props): JSX.Element => {
  const { tag, filteredEntries } = props;
  const title = retrieveTranslation('tags.headings.entryList', { tag });
  const webSiteTitle = retrieveTranslation('website.title');
  const titleInHead = addSiteTitleToSuffix(title);
  const description = retrieveTranslation('tags.description', { tag, webSiteTitle });
  const pageUrl = `${SITE_URL}${pathList.tags}/${tag}`;

  const e = (
    <>
      <Head>
        <title>{titleInHead}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={titleInHead} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={pageUrl} />
      </Head>
      <EntryList title={title} entries={filteredEntries} />
    </>
  );

  return e;
};

export async function getStaticPaths(): Promise<{
  paths: { params: { [tag: string]: string } }[];
  fallback: boolean;
}> {
  const tagIdList = await getTagIdList();
  const paths = tagIdList.map((tag) => ({
    params: { tag },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: GetStaticPropsContext): Promise<{ props: Props }> {
  const tag = Array.isArray(params.tag) ? params.tag.join() : params.tag;
  const filteredEntries = await getEntryListByTag(tag);

  return {
    props: {
      filteredEntries,
      tag,
    },
  };
}

export default TagPage;
