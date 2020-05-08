import React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';

import { EntryValue } from '../../entry/entryValue';
import { EntryList } from '../../entry/components/EntryList';
import { SiteContents } from '../../components/SiteContents';
import entries from '../../data/entries.json';

interface Props {
  filteredEntries: Array<EntryValue>;
  tag?: string;
}

const ArticlesTitle = styled.h2``;

export const TagPage = (props: Props): JSX.Element => {
  const { tag, filteredEntries } = props;

  const e = (
    <SiteContents>
      <ArticlesTitle>{`${tag}の記事一覧`}</ArticlesTitle>
      <EntryList entries={filteredEntries} />
    </SiteContents>
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
