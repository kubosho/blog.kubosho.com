import React from 'react';
import styled from 'styled-components';

import { SPACE } from '../../common_styles/space';
import { TwitterLink, FacebookLink } from './SnsLink';

interface Props {
  shareText: string;
}

const SnsLinkList = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
`;
const SnsLinkListItem = styled.li`
  margin-right: calc(${SPACE} * 3);

  &:last-child {
    margin-right: 0;
  }
`;

export const SnsShare = ({ shareText }: Props): JSX.Element => (
  <SnsLinkList>
    <SnsLinkListItem>
      <TwitterLink shareText={shareText} />
    </SnsLinkListItem>
    <SnsLinkListItem>
      <FacebookLink />
    </SnsLinkListItem>
  </SnsLinkList>
);
