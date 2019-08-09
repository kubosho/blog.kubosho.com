import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { isNotNull } from 'option-t/lib/Nullable/Nullable';

import { SiteHeader } from '../components/SiteHeader';
import entries from '../data/entries.json';

const ArticlesTitle = styled.h2``;
const Article = styled.article``;
const EntryTitle = styled.h3``;
const Contents = styled.p``;
const NotFound = styled.p``;

const TopPage = (): JSX.Element => (
  <React.Fragment>
    <SiteHeader />
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
  </React.Fragment>
);

export default TopPage;
