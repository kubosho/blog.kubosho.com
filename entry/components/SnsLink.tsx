import React from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { SPACE } from '../../common_styles/space';
import { FACEBOOK_APP_ID, SITE_URL, TWITTER_ACCOUNT_ID } from '../../constants/site_data';
import { TwitterIcon, FacebookIcon } from './SnsIcon';

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
    width: 0.875rem;
    height: 0.875rem;

    @media (min-width: 37.5rem) {
      width: calc(0.875rem + (1vw - 0.375rem) * (16 / (854 - 600)));
      height: calc(0.875rem + (1vw - 0.375rem) * (16 / (854 - 600)));
    }

    @media (min-width: 52.125rem) {
      width: 1rem;
      height: 1rem;
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
  const shareUrl = `http://twitter.com/intent/tweet?url=${currentUrl}&text=${shareText}&via=${TWITTER_ACCOUNT_ID}&related=${TWITTER_ACCOUNT_ID}`;

  return (
    <TwitterLinkContainer href={shareUrl} rel="noopener noreferrer" target="_blank">
      <TwitterIcon />
      <SnsLinkText>ツイート</SnsLinkText>
    </TwitterLinkContainer>
  );
};

export const FacebookLink = (): JSX.Element => {
  const currentUrl = getCurrentUrl();
  const shareUrl = `https://www.facebook.com/dialog/share?app_id=${FACEBOOK_APP_ID}&display=popup&href=${currentUrl}`;

  return (
    <FacebookLinkContainer
      href={shareUrl}
      rel="noopener noreferrer"
      target="_blank"
      onClick={() => onClickFacebookLink(shareUrl)}
    >
      <FacebookIcon />
      <SnsLinkText>シェア</SnsLinkText>
    </FacebookLinkContainer>
  );
};

function getCurrentUrl(): string {
  const router = useRouter();
  return `${SITE_URL}${router.asPath}`;
}

function onClickFacebookLink(url: string): unknown {
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  // eslint-disable-next-line no-undef
  return FB.ui({
    display: 'popup',
    method: 'share',
    href: url,
  });
}
