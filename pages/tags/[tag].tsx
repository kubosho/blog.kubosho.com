import React from 'react';
import styled from 'styled-components';
import { NextPageContext } from 'next';

import { CONTENTS_SEPARATOR_SPACE } from '../../common_styles/space';
import { SITE_WIDTH } from '../../common_styles/size';
import { EntryValue } from '../../entry/entryValue';
import { EntryList } from '../../entry/components/EntryList';
import entries from '../../data/entries.json';

interface Props {
  filteredEntries: Array<EntryValue>;
  tag?: string;
}

const SiteContents = styled.main`
  max-width: ${SITE_WIDTH};
  margin: ${CONTENTS_SEPARATOR_SPACE} auto 0;
  padding: 0 1rem;
`;
const ArticlesTitle = styled.h2``;

export const TagPage = (props: Props): JSX.Element => {
  const { tag, filteredEntries } = props;

  const e = (
    <React.Fragment>
      <SiteContents>
        <ArticlesTitle>{`${tag}の記事一覧`}</ArticlesTitle>
        <EntryList entries={filteredEntries} />
      </SiteContents>
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
