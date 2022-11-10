import React from 'react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';

import { EntryValue } from '../../entry/entry_value';
import { EntryList } from '../../components/EntryList';
import { addSiteTitleToSuffix } from '../../site_title_inserter';
import { getCategoryIdList, getEntryListByCategory } from '../../entry/entry_gateway';
import { retrieveTranslation } from '../../locales/i18n';

interface Props {
  filteredEntries: Array<EntryValue>;
  category?: string;
}

export const CategoryPage = (props: Props): JSX.Element => {
  const { category, filteredEntries } = props;
  const title = retrieveTranslation('categories.headings.entryList', { category });
  const webSiteTitle = retrieveTranslation('website.title');
  const titleInHead = addSiteTitleToSuffix(title);
  const description = retrieveTranslation('categories.description', { category, webSiteTitle });

  const e = (
    <>
      <Head>
        <title>{titleInHead}</title>
        <meta name="description" content={description} />
      </Head>
      <EntryList title={title} entries={filteredEntries} />
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
