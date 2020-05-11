import React from 'react';
import { NextPageContext } from 'next';
import Head from 'next/head';

import entries from '../../../data/entries.json';
import { EntryList } from '../../entry/components/EntryList';
import { EntryValue } from '../../entry/entryValue';
import { SiteContents } from '../../components/SiteContents';
import { addSiteTitleToSuffix } from '../../site_meta_data/site_title_inserter';
import { SITE_TITLE, SITE_URL } from '../../constants/site_data';

type Props = {
  filteredEntries: Array<EntryValue>;
  category?: string;
};

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
        <h2>{title}</h2>
        <EntryList entries={filteredEntries} />
      </SiteContents>
    </>
  );

  return e;
};

CategoryPage.getInitialProps = ({ query }: NextPageContext) => {
  const filteredEntries = entries.filter((entry) => entry.categories.find((category) => category === query.category));

  return {
    category: query.category,
    filteredEntries,
  };
};

export default CategoryPage;
