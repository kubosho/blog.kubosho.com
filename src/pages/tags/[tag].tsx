import React from 'react';
import { NextPageContext } from 'next';
import Head from 'next/head';

import { getEntryList } from '../../entry/entryDelivery';
import { EntryValue } from '../../entry/entryValue';
import { EntryList } from '../../entry/components/EntryList';
import { SiteContents } from '../../components/SiteContents';
import { addSiteTitleToSuffix } from '../../site_meta_data/site_title_inserter';
import { SITE_TITLE, SITE_URL } from '../../constants/site_data';

interface Props {
  filteredEntries: Array<EntryValue>;
  tag?: string;
}

export const TagPage = (props: Props): JSX.Element => {
  const { tag, filteredEntries } = props;
  const title = `${tag}の記事一覧`;
  const titleInHead = addSiteTitleToSuffix(title);
  const description = `${SITE_TITLE}の「${tag}」に関連した記事の一覧です。`;
  const pageUrl = `${SITE_URL}/tags/${tag}`;

  const e = (
    <>
      <Head>
        <title>{titleInHead}</title>
        <meta property="og:title" content={titleInHead} />
        <meta name="description" content={description} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
      </Head>
      <SiteContents>
        <h2>{title}</h2>
        <EntryList entries={filteredEntries} />
      </SiteContents>
    </>
  );

  return e;
};

TagPage.getInitialProps = ({ query }: NextPageContext) => {
  const entries = getEntryList();
  const filteredEntries = entries.filter((entry) => entry.tags.find((tag) => tag === query.tag));

  return {
    tag: query.tag,
    filteredEntries,
  };
};

export default TagPage;
