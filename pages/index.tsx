import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import { isNotNull } from 'option-t/lib/Nullable/Nullable';

import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../constants';
import { CONTENTS_SEPARATOR_SPACE, SPACE } from '../common_styles/space';
import { SITE_WIDTH } from '../common_styles/size';
import { LARGE_FONT_SIZE } from '../common_styles/text';
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
  position: relative;
  margin: calc(${CONTENTS_SEPARATOR_SPACE} / 2) 0;
`;
const StyledLink = styled.a`
  font-size: ${LARGE_FONT_SIZE};
`;
const Contents = styled.p`
  margin: 0;
`;
const Date = styled.div`
  color: rgba(0, 0, 0, 0.75);

  @media (min-width: 67.5rem) {
    position: absolute;
    top: ${SPACE};
    left: calc(${CONTENTS_SEPARATOR_SPACE} * -1.5);
  }
`;
const NotFound = styled.p``;

const TopPage = (): JSX.Element => {
  const e = (
    <React.Fragment>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="//images.ctfassets.net/jkycobgkkwnp/7bcr2cdqYngCIxVADlPZlf/077f0b93c117018d56f51df99ac18e0b/og_image.png"
        />
      </Head>
      <SiteHeader />
      <SiteContents>
        <ArticlesTitle>記事一覧</ArticlesTitle>
        {isNotNull(entries) && entries.length > 1 ? (
          entries.map(entry => {
            const { excerpt, id, slug, title, createdAt } = entry;

            return (
              <Article key={id}>
                <Link href="/entry/[slug]" as={`/entry/${slug}`} passHref>
                  <StyledLink>{title}</StyledLink>
                </Link>
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

  return e;
};

export default TopPage;
