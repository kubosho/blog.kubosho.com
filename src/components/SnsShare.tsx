import React, { MouseEvent } from 'react';
import { useRouter } from 'next/router';

import { FACEBOOK_APP_ID, SITE_URL, TWITTER_ACCOUNT_ID } from '../constants/site_data';
import { SnsShareUrl } from '../constants/sns_share_url';

import { TwitterSvg } from './icon/twitter';
import { FacebookSvg } from './icon/facebook';

import styles from './SnsShare.module.css';

interface Props {
  shareText: string;
}

const TwitterLink = ({ shareText }: Props): JSX.Element => {
  const currentUrl = getCurrentUrl();
  const shareUrl = `${SnsShareUrl.Twitter}?url=${currentUrl}&text=${shareText}&via=${TWITTER_ACCOUNT_ID}&related=${TWITTER_ACCOUNT_ID}`;

  return (
    <a className={styles['twitter-link']} href={shareUrl} rel="noopener noreferrer" target="_blank">
      <TwitterSvg />
      ツイート
    </a>
  );
};

const FacebookLink = (): JSX.Element => {
  const currentUrl = getCurrentUrl();
  const shareUrl = `${SnsShareUrl.Facebook}?app_id=${FACEBOOK_APP_ID}&display=page&href=${currentUrl}`;

  return (
    <a
      className={styles['facebook-link']}
      href={shareUrl}
      rel="noopener noreferrer"
      target="_blank"
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClickFacebookLink(event, currentUrl);
      }}
    >
      <FacebookSvg />
      シェア
    </a>
  );
};

export const SnsShare = ({ shareText }: Props): JSX.Element => (
  <ul className={styles['sns-link-list']}>
    <li>
      <TwitterLink shareText={shareText} />
    </li>
    <li>
      <FacebookLink />
    </li>
  </ul>
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
