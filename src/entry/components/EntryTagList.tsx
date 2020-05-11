import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { TagList, TagListItem } from '../../components/TagList';
import { SPACE } from '../../common_styles/space';

interface Props {
  tags: Array<string>;
}

const CustomTagList = styled(TagList)`
  margin: calc(calc(1rem * 5) / 2) 0 !important;
`;

const StyledLink = styled.a`
  display: block;
  padding: calc(${SPACE} / 2) calc(${SPACE} * 2);
`;

export const EntryTagList = ({ tags }: Props): JSX.Element => (
  <CustomTagList>
    {tags.map((tag, i) => (
      <TagListItem key={`${tag}_${i}`}>
        <Link href="/tags/[tag]" as={`/tags/${tag}`} passHref>
          <StyledLink>{tag}</StyledLink>
        </Link>
      </TagListItem>
    ))}
  </CustomTagList>
);
