import React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';
import Link from 'next/link';

import { CONTENTS_SEPARATOR_SPACE, SPACE } from '../../common_styles/space';
import { SITE_WIDTH } from '../../common_styles/size';
import { LARGE_FONT_SIZE } from '../../common_styles/text';
import { PublishedDate } from '../../components/PublishedDate';
import { SiteHeader } from '../../components/SiteHeader';
import { SiteFooter } from '../../components/SiteFooter';
import { EntryValue } from '../../entry/entryValue';
import entries from '../../data/entries.json';

type Props = {
  filteredEntries: Array<EntryValue>;
  tag?: string;
};

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

export const TagPage = (props: Props): JSX.Element => {
  const { tag, filteredEntries } = props;

  const e = (
    <React.Fragment>
      <SiteHeader />
      <SiteContents>
        <ArticlesTitle>{`${tag}の記事一覧`}</ArticlesTitle>
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => {
            const { excerpt, id, slug, title, createdAt } = entry;
            const e = (
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

            return e;
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

TagPage.getInitialProps = ({ query }: NextPageContext) => {
  const filteredEntries = entries.filter((entry) => entry.tags.find((tag) => tag === query.tag));

  return {
    tag: query.tag,
    filteredEntries,
  };
};

export default TagPage;
