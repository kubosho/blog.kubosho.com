import React from 'react';
import { NextPageContext } from 'next';
import Head from 'next/head';

import { EntryList } from '../../entry/components/EntryList';
import { EntryValue } from '../../entry/entryValue';
import { SiteContents } from '../../components/SiteContents';
import { addSiteTitleToSuffix } from '../../site_meta_data/site_title_inserter';
import { SITE_TITLE, SITE_URL } from '../../constants/site_data';
import { fetchEntriesByCategory } from '../../entry/entryGateway';

interface Props {
  filteredEntries: Array<EntryValue>;
  category?: string;
}

export const CategoryPage = (props: Props): JSX.Element => {
  const { category, filteredEntries } = props;
  const title = `${category}の記事一覧`;
  const titleInHead = addSiteTitleToSuffix(title);
  const description = `${SITE_TITLE}の「${category}」に関連した記事の一覧です。`;
  const pageUrl = `${SITE_URL}/categories/${category}`;

  const e = (
    <>
      <Head>
        <title>{titleInHead}</title>
        <meta property="og:title" content={titleInHead} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="website" />
      </Head>
      <SiteContents>
        <EntryList title={title} entries={filteredEntries} />
      </SiteContents>
    </>
  );

  return e;
};

export async function getServerSideProps({ query }: NextPageContext): Promise<{ props: Props }> {
  let category = query.category;

  if (Array.isArray(category)) {
    category = category.join();
  }

  const filteredEntries = await fetchEntriesByCategory(category);

  return {
    props: {
      filteredEntries,
      category,
    },
  };
}

export default CategoryPage;
