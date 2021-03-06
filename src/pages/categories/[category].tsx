import React from 'react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { EntryValue } from '../../entry/entryValue';
import { EntryList } from '../../components/EntryList';
import { SiteContents } from '../../components/SiteContents';
import { addSiteTitleToSuffix } from '../../site_title_inserter';
import { SITE_TITLE, SITE_URL } from '../../constants/site_data';
import { getCategoryIdList, getEntryListByCategory } from '../../entry/entryGateway';

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

export async function getStaticPaths(): Promise<{
  paths: { params: { [category: string]: string } }[];
  fallback: boolean;
}> {
  const categoryIdList = await getCategoryIdList();
  const paths = categoryIdList.map((category) => ({
    params: { category },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: GetStaticPropsContext): Promise<{ props: Props }> {
  const category = Array.isArray(params.category) ? params.category.join() : params.category;
  const filteredEntries = await getEntryListByCategory(category);

  return {
    props: {
      category,
      filteredEntries,
    },
  };
}

export default CategoryPage;
