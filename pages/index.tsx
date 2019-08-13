import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import { isNotNull } from 'option-t/lib/Nullable/Nullable';

import { SITE_TITLE } from '../constants';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import entries from '../data/entries.json';

const ArticlesTitle = styled.h2``;
const Article = styled.article``;
const EntryTitle = styled.h3``;
const Contents = styled.p``;
const NotFound = styled.p``;

const TopPage = (): JSX.Element => (
  <React.Fragment>
    <Head>
      <title>{SITE_TITLE}</title>
    </Head>
    <SiteHeader />
    <main>
      <ArticlesTitle>最近の記事</ArticlesTitle>
      {isNotNull(entries) ? (
        entries.map(entry => {
          const { excerpt, id, slug, title } = entry;

          return (
            <Article key={id}>
              <EntryTitle>
                <Link href="/entry/[slug]" as={`/entry/${slug}`}>
                  <a>{title}</a>
                </Link>
              </EntryTitle>
              <Contents dangerouslySetInnerHTML={{ __html: excerpt }} />
            </Article>
          );
        })
      ) : (
        <NotFound>記事はありません。</NotFound>
      )}
    </main>
    <SiteFooter />
  </React.Fragment>
);

export default TopPage;
