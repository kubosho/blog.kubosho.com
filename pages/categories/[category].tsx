import React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';

import { EntryList } from '../../entry/components/EntryList';
import { EntryValue } from '../../entry/entryValue';
import { SiteContents } from '../../components/SiteContents';
import entries from '../../data/entries.json';

type Props = {
  filteredEntries: Array<EntryValue>;
  category?: string;
};

const ArticlesTitle = styled.h2``;

export const CategoryPage = (props: Props): JSX.Element => {
  const { category, filteredEntries } = props;

  const e = (
    <SiteContents>
      <ArticlesTitle>{`${category}の記事一覧`}</ArticlesTitle>
      <EntryList entries={filteredEntries} />
    </SiteContents>
  );

  return e;
};

CategoryPage.getInitialProps = ({ query }: NextPageContext) => {
  const filteredEntries = entries.filter((entry) => entry.categories.find((category) => category === query.category));

  return {
    category: query.category,
    filteredEntries,
  };
};

export default CategoryPage;
