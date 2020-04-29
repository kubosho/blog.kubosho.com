import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { isNotNull } from 'option-t/lib/Nullable/Nullable';

import { formatYYMMDDString, formatISOString } from '../date';
import { EntryValue } from '../entryValue';
import { PublishedDateContainer, PublishedDate } from '../../components/PublishedDate';
import { SPACE } from '../../common_styles/space';
import { BORDER_COLOR, TEXT_COLOR } from '../../common_styles/color';
import { EntryContents } from './EntryContents';

const StyledLink = styled.a`
  color: ${TEXT_COLOR};
  text-decoration: none;
`;
const Article = styled.article`
  padding: 0 calc(${SPACE} * 3) calc(${SPACE} * 6);
  margin-bottom: calc(${SPACE} * 6);
  border-bottom: 1px solid ${BORDER_COLOR};

  &:last-child {
    border-bottom: none;
  }

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
const DateContainer = styled(PublishedDateContainer)`
  margin: 0 calc(${SPACE} * -10) 0 calc(${SPACE} * 3);
`;
const Excerpt = styled(EntryContents)`
  overflow: hidden;
  text-overflow: ellipsis;
  margin: calc(${SPACE} * 3) 0 0;

  @supports (-webkit-line-clamp: 2) {
    /* stylelint-disable-next-line value-no-vendor-prefix */
    display: -webkit-box;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-box-orient: vertical;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-line-clamp: 2;
  }
`;
const ExcerptInner = styled.p`
  margin: 0;
`;
const NotFound = styled.p``;

interface Props {
  entries: Array<EntryValue> | null;
}

export const EntryList = ({ entries }: Props): JSX.Element =>
  isNotNull(entries) && entries.length >= 1 ? (
    <>
      {entries.map((entry) => {
        const { excerpt, id, slug, title, createdAt } = entry;
        const dateTime = formatISOString(createdAt);
        const timeValue = formatYYMMDDString(createdAt);

        return (
          <Article key={id}>
            <ArticleHeader>
              <ArticleTitle>
                <Link href="/entry/[slug]" as={`/entry/${slug}`} passHref>
                  <StyledLink>{title}</StyledLink>
                </Link>
              </ArticleTitle>
              <DateContainer>
                <PublishedDate dateTime={dateTime}>{timeValue}</PublishedDate>
              </DateContainer>
            </ArticleHeader>
            <Excerpt>
              <ExcerptInner dangerouslySetInnerHTML={{ __html: excerpt }} />
            </Excerpt>
          </Article>
        );
      })}
    </>
  ) : (
    <NotFound>記事はありません。</NotFound>
  );
