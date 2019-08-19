import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import { isNotNull } from 'option-t/lib/Nullable/Nullable';

import { SITE_TITLE } from '../constants';
import { CONTENTS_SEPARATOR_SPACE } from '../common_styles/space';
import { SITE_WIDTH } from '../common_styles/size';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { PublishedDate } from '../components/PublishedDate';
import entries from '../data/entries.json';

const SiteContents = styled.main`
  max-width: ${SITE_WIDTH};
  margin: ${CONTENTS_SEPARATOR_SPACE} auto 0;
  padding: 0 1rem;
`;
const ArticlesTitle = styled.h2``;
const Article = styled.article`
  margin: calc(${CONTENTS_SEPARATOR_SPACE} / 2) 0;
`;
const EntryTitle = styled.h3`
  margin: 0;
  font-weight: normal;
`;
const Contents = styled.p`
  margin: 0;
`;
const NotFound = styled.p``;

const TopPage = (): JSX.Element => (
  <React.Fragment>
    <Head>
      <title>{SITE_TITLE}</title>
    </Head>
    <SiteHeader />
    <SiteContents>
      <ArticlesTitle>最近の記事</ArticlesTitle>
      {isNotNull(entries) ? (
        entries.map(entry => {
          const { excerpt, id, slug, title, createdAt } = entry;

          return (
            <Article key={id}>
              <EntryTitle>
                <Link href="/entry/[slug]" as={`/entry/${slug}`}>
                  <a>{title}</a>
                </Link>
              </EntryTitle>
              <Contents dangerouslySetInnerHTML={{ __html: excerpt }} />
              <Date>
                <PublishedDate createdAt={createdAt} />
              </Date>
            </Article>
          );
        })
      ) : (
        <NotFound>記事はありません。</NotFound>
      )}
    </SiteContents>
    <SiteFooter />
  </React.Fragment>
);

export default TopPage;
