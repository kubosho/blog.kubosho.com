import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { isNotNull } from 'option-t/lib/Nullable/Nullable';

import { PublishedDate } from '../../components/PublishedDate';
import { SPACE } from '../../common_styles/space';
import { TEXT_COLOR, MAIN_COLOR } from '../../common_styles/color';
import { formatYYMMDDString, formatISOString } from '../date';
import { EntryValue } from '../entryValue';
import { Excerpt } from './Excerpt';

const ArticleList = styled.ol`
  list-style-type: none;
  padding: 0;
`;

const Article = styled.li`
  display: grid;
  grid-template-areas:
    'title date'
    'excerpt excerpt';
  grid-template-columns: 1fr auto;
  grid-template-rows: 1fr auto;
  padding: 0 calc(${SPACE} * 3) calc(${SPACE} * 6);
  margin-bottom: calc(${SPACE} * 6);

  @media (min-width: 52.125rem) {
    padding: 0 0 calc(${SPACE} * 6);
  }
`;

const ArticleTitle = styled.p`
  grid-area: title;
  margin: 0;
  font-size: 1rem;
  font-weight: bold;

  @media (min-width: 37.5rem) {
    font-size: calc(1rem + ((1vw - 0.375rem) * 3.419));

    &::before {
      content: '■';
      display: inline-block;
      margin-right: calc(${SPACE} * 2);
      color: ${MAIN_COLOR};
    }
  }

  @media (min-width: 52.125rem) {
    font-size: 1.5rem;
  }
`;

const StyledLink = styled.a`
  color: ${TEXT_COLOR};
`;

const ModifiedDate = styled(PublishedDate)`
  display: table;
  grid-area: date;
  margin: 0 calc(${SPACE} * -6) 0 calc(${SPACE} * 3);
`;

const ModifiedExcerpt = styled(Excerpt)`
  grid-area: excerpt;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: ${SPACE} 0 0;

  @supports (-webkit-line-clamp: 2) {
    /* stylelint-disable-next-line value-no-vendor-prefix */
    display: -webkit-box;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-box-orient: vertical;
    /* stylelint-disable-next-line property-no-vendor-prefix */
    -webkit-line-clamp: 2;
  }
`;

const NotFound = styled.p``;

interface Props {
  entries: Array<EntryValue> | null;
}

export const EntryList = ({ entries }: Props): JSX.Element =>
  isNotNull(entries) && entries.length >= 1 ? (
    <ArticleList>
      {entries.map((entry) => {
        const { excerpt, id, title, createdAt } = entry;
        const dateTime = formatISOString(createdAt);
        const timeValue = formatYYMMDDString(createdAt);

        return (
          <Article key={id}>
            <ArticleTitle>
              <Link href="/entry/[id]" as={`/entry/${id}`} passHref>
                <StyledLink>{title}</StyledLink>
              </Link>
            </ArticleTitle>
            <ModifiedDate dateTime={dateTime}>{timeValue}</ModifiedDate>
            <ModifiedExcerpt dangerouslySetInnerHTML={{ __html: excerpt }} />
          </Article>
        );
      })}
    </ArticleList>
  ) : (
    <NotFound>記事はありません。</NotFound>
  );
