import React from 'react';
import styled from 'styled-components';
import Head from 'next/head';
import Link from 'next/link';
import { isNotNull } from 'option-t/lib/Nullable/Nullable';

import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from '../constants';
import { SITE_WIDTH } from '../common_styles/size';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { PublishedDate } from '../components/PublishedDate';
import { BORDER_COLOR, TEXT_COLOR, LINK_COLOR, TEXT_COLOR_LIGHT, MAIN_COLOR, SUB_COLOR } from '../common_styles/color';
import entries from '../data/entries.json';
import { NOTE_FONT_SIZE } from '../common_styles/text';
import { SPACE } from '../common_styles/space';

const SiteContents = styled.main`
  max-width: ${SITE_WIDTH};
  margin: calc(${SPACE} * 15) auto 0;
`;
const Article = styled.article`
  padding-bottom: calc(${SPACE} * 6);
  margin-bottom: calc(${SPACE} * 6);
  border-bottom: 1px solid ${BORDER_COLOR};
`;
const ArticleHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Tags = styled.ul`
  display: flex;
  list-style-type: none;
  padding: 0;
  margin: calc(${SPACE} * 3) 0 0;
  color: ${TEXT_COLOR_LIGHT};
  font-size: ${NOTE_FONT_SIZE};
`;
const Tag = styled.li`
  display: flex;
  align-items: center;
  padding: calc(${SPACE} / 2) calc(${SPACE} * 2);
  margin-left: calc(${SPACE} * 3);
  background-color: ${SUB_COLOR};

  &:first-child {
    margin-left: 0;
  }

  a:link,
  a:visited {
    color: ${TEXT_COLOR_LIGHT};
    text-decoration: none;
  }
`;
const StyledLink = styled.a`
  color: ${TEXT_COLOR};
  font-size: 1.5rem;
  font-weight: 700;
  text-decoration: none;
`;
const Contents = styled.p`
  margin: calc(${SPACE} * 3) 0 0;

  a:link,
  a:visited {
    color: ${LINK_COLOR};
  }
`;
const Date = styled.div`
  display: inline-block;
  padding: calc(${SPACE} / 2) calc(${SPACE} * 10) calc(${SPACE} / 2) ${SPACE};
  margin-right: calc(${SPACE} * -10);
  background-color: ${MAIN_COLOR};
  color: ${TEXT_COLOR_LIGHT};
  font-size: ${NOTE_FONT_SIZE};
`;
const NotFound = styled.p``;

const TopPage = (): JSX.Element => {
  const e = (
    <React.Fragment>
      <Head>
        <title>{SITE_TITLE}</title>
        <meta property="og:title" content={SITE_TITLE} />
        <meta property="og:site_name" content={SITE_TITLE} />
        <meta property="og:description" content={SITE_DESCRIPTION} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="//images.ctfassets.net/jkycobgkkwnp/7bcr2cdqYngCIxVADlPZlf/077f0b93c117018d56f51df99ac18e0b/og_image.png"
        />
        <meta property="fb:app_id" content="2453282784920956" />
      </Head>
      <SiteHeader />
      <SiteContents>
        {isNotNull(entries) && entries.length > 1 ? (
          entries.map(entry => {
            const { excerpt, id, slug, title, tags, createdAt } = entry;

            return (
              <Article key={id}>
                <ArticleHeader>
                  <div>
                    <Link href="/entry/[slug]" as={`/entry/${slug}`} passHref>
                      <StyledLink>{title}</StyledLink>
                    </Link>
                    {tags.length >= 1 && (
                      <Tags>
                        {tags.map((tag, i) => (
                          <Tag key={`${tag}_${i}`}>
                            <Link href="/tags/[tag]" as={`/tags/${tag}`}>
                              <a>{tag}</a>
                            </Link>
                          </Tag>
                        ))}
                      </Tags>
                    )}
                  </div>
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
