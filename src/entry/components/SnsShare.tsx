import React, { MouseEvent } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { FACEBOOK_APP_ID, SITE_URL, TWITTER_ACCOUNT_ID } from '../../constants/site_data';
import { SPACE } from '../../common_styles/space';
import { SNS_ICON_COLOR } from '../../common_styles/color';
import { BASE_FONT_SIZE } from '../../common_styles/text';
import { TwitterSvg } from '../../components/icon/twitter';
import { FacebookSvg } from '../../components/icon/facebook';

interface Props {
  shareText: string;
}

const TWITTER_COLOR = '#1da1f2';
const TWITTER_HOVER_COLOR = '#1887cc';
const FACEBOOK_COLOR = '#1778f2';
const FACEBOOK_HOVER_COLOR = '#1467cc';

const SnsLink = styled.a`
  display: flex;
  align-items: center;
  padding: calc(${SPACE} / 4) calc(${SPACE} * 2);
  border-radius: 4px;
  color: #fff;
  text-decoration: none;

  > svg {
    width: ${BASE_FONT_SIZE};
    height: ${BASE_FONT_SIZE};
    fill: ${SNS_ICON_COLOR};

    @media (min-width: 37.5rem) {
      width: calc(${BASE_FONT_SIZE} + (1vw - 0.375rem) * (16 / (854 - 600)));
      height: calc(${BASE_FONT_SIZE} + (1vw - 0.375rem) * (16 / (854 - 600)));
    }

    @media (min-width: 52.125rem) {
      width: calc(${BASE_FONT_SIZE} * 1.125);
      height: calc(${BASE_FONT_SIZE} * 1.125);
    }
  }
`;

const SnsLinkText = styled.span`
  margin-left: ${SPACE};
`;

const TwitterLinkContainer = styled(SnsLink)`
  background-color: ${TWITTER_COLOR};

  &:hover {
    background-color: ${TWITTER_HOVER_COLOR};
  }
`;

const FacebookLinkContainer = styled(SnsLink)`
  background-color: ${FACEBOOK_COLOR};

  &:hover {
    background-color: ${FACEBOOK_HOVER_COLOR};
  }
`;

export const TwitterLink = ({ shareText }: Props): JSX.Element => {
  const currentUrl = getCurrentUrl();
  const shareUrl = `//twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}&via=${TWITTER_ACCOUNT_ID}&related=${TWITTER_ACCOUNT_ID}`;

  return (
    <TwitterLinkContainer href={shareUrl} rel="noopener noreferrer" target="_blank">
      <TwitterSvg />
      <SnsLinkText>ツイート</SnsLinkText>
    </TwitterLinkContainer>
  );
};

export const FacebookLink = (): JSX.Element => {
  const currentUrl = getCurrentUrl();
  const shareUrl = `//www.facebook.com/dialog/share?app_id=${FACEBOOK_APP_ID}&display=page&href=${currentUrl}`;

  return (
    <FacebookLinkContainer
      href={shareUrl}
      rel="noopener noreferrer"
      target="_blank"
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClickFacebookLink(event, currentUrl);
      }}
    >
      <FacebookSvg />
      <SnsLinkText>シェア</SnsLinkText>
    </FacebookLinkContainer>
  );
};
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

function getCurrentUrl(): string {
  const router = useRouter();
  return `${SITE_URL}${router.asPath}`;
}

function onClickFacebookLink(event: MouseEvent<HTMLAnchorElement>, url: string): void {
  event.preventDefault();
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // eslint-disable-next-line no-undef
  return FB.ui({
    display: 'popup',
    method: 'share',
    href: url,
  });
}
