import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { TagList, TagListItem } from '../../components/TagList';

interface Props {
  tags: Array<string>;
}

const CustomTagList = styled(TagList)`
  margin: calc(calc(1rem * 5) / 2) 0 !important;
`;

export const EntryTagList = ({ tags }: Props): JSX.Element => (
  <CustomTagList>
    {tags.map((tag, i) => (
      <TagListItem key={`${tag}_${i}`}>
        <Link href="/tags/[tag]" as={`/tags/${tag}`}>
          <a>{tag}</a>
        </Link>
      </TagListItem>
    ))}
  </CustomTagList>
);
