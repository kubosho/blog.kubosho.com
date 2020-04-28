import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import { isNotNull } from 'option-t/lib/Nullable/Nullable';

import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../constants/site_data';
import { SITE_WIDTH } from '../common_styles/size';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { PublishedDate } from '../components/PublishedDate';
import { BORDER_COLOR, TEXT_COLOR, LINK_COLOR, TEXT_COLOR_LIGHT, MAIN_COLOR } from '../common_styles/color';
import entries from '../data/entries.json';
import { NOTE_FONT_SIZE } from '../common_styles/text';
import { SPACE } from '../common_styles/space';

const SiteContents = styled.main`
  max-width: ${SITE_WIDTH};
  margin: calc(${SPACE} * 15) auto 0;
`;
const Article = styled.article`
  padding: 0 calc(${SPACE} * 3) calc(${SPACE} * 6);
  margin-bottom: calc(${SPACE} * 6);
  border-bottom: 1px solid ${BORDER_COLOR};

  @media (min-width: 52.125rem) {
    padding: 0 0 calc(${SPACE} * 6);
  }
`;
const ArticleHeader = styled.header`
  display: grid;
  grid-template-areas:
    'title date'
    'tags tags';
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
`;
const ArticleTitle = styled.h2`
  grid-area: title;
  margin: 0;
  font-size: 1rem;

  @media (min-width: 37.5rem) {
    font-size: calc(1rem + ((1vw - 0.375rem) * 3.419));
  }

  @media (min-width: 52.125rem) {
    font-size: 1.5rem;
  }
`;
const StyledLink = styled.a`
  color: ${TEXT_COLOR};
  text-decoration: none;
`;
const Date = styled.div`
  grid-area: date;
  margin: 0 calc(${SPACE} * -10) 0 calc(${SPACE} * 3);
  color: ${TEXT_COLOR_LIGHT};
  font-size: ${NOTE_FONT_SIZE};

  time {
    display: inline-block;
    padding: calc(${SPACE} / 2) calc(${SPACE} * 10) calc(${SPACE} / 2) ${SPACE};
    background-color: ${MAIN_COLOR};
  }
`;
const Contents = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  margin: calc(${SPACE} * 3) 0 0;
  font-size: 0.875rem;

  @supports (-webkit-line-clamp: 2) {
    /* stylelint-disable-next-line value-no-vendor-prefix */
    display: -webkit-box;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-box-orient: vertical;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-line-clamp: 2;
  }

  @media (min-width: 37.5rem) {
    font-size: calc(0.875rem + (1vw - 0.375rem) * (16 / (854 - 600)));
  }

  @media (min-width: 52.125rem) {
    font-size: 1rem;
  }

  a:link,
  a:visited {
    color: ${LINK_COLOR};
  }
`;
const NotFound = styled.p``;

const TopPage = (): JSX.Element => {
  const e = (
    <React.Fragment>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta itemProp="name" content={SITE_TITLE} />
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:site_name" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="//images.ctfassets.net/jkycobgkkwnp/7bcr2cdqYngCIxVADlPZlf/077f0b93c117018d56f51df99ac18e0b/og_image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="fb:app_id" content="2453282784920956" />
      </Head>
      <SiteHeader />
      <SiteContents>
        {isNotNull(entries) && entries.length > 1 ? (
          entries.map((entry) => {
            const { excerpt, id, slug, title, createdAt } = entry;

            return (
              <Article key={id}>
                <ArticleHeader>
                  <ArticleTitle>
                    <Link href="/entry/[slug]" as={`/entry/${slug}`} passHref>
                      <StyledLink>{title}</StyledLink>
                    </Link>
                  </ArticleTitle>
                  <Date>
                    <PublishedDate createdAt={createdAt} />
                  </Date>
                </ArticleHeader>
                <Contents dangerouslySetInnerHTML={{ __html: excerpt }} />
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
