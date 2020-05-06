import React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';

import { CONTENTS_SEPARATOR_SPACE } from '../../common_styles/space';
import { SITE_WIDTH } from '../../common_styles/size';
import { EntryValue } from '../../entry/entryValue';
import entries from '../../data/entries.json';
import { EntryList } from '../../entry/components/EntryList';

type Props = {
  filteredEntries: Array<EntryValue>;
  category?: string;
};

const SiteContents = styled.main`
  max-width: ${SITE_WIDTH};
  margin: ${CONTENTS_SEPARATOR_SPACE} auto 0;
  padding: 0 1rem;
`;
const ArticlesTitle = styled.h2``;

export const CategoryPage = (props: Props): JSX.Element => {
  const { category, filteredEntries } = props;

  const e = (
    <React.Fragment>
      <SiteContents>
        <ArticlesTitle>{`${category}の記事一覧`}</ArticlesTitle>
        <EntryList entries={filteredEntries} />
      </SiteContents>
    </React.Fragment>
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
