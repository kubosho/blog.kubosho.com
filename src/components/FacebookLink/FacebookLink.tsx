import React from 'react';
import { MouseEvent } from 'react';
import { useRouter } from 'next/router';

import { FACEBOOK_APP_ID, SITE_URL } from '../../constants/site_data';
import { SnsShareUrl } from '../../constants/sns_share_url';
import { FacebookSvg } from '../SnsIcon/Facebook';

import styles from './FacebookLink.module.css';

export const FacebookLink = (): JSX.Element => {
  const router = useRouter();
  const currentUrl = `${SITE_URL}${router.asPath}`;
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
    </a>
  );
};

function onClickFacebookLink(event: MouseEvent<HTMLAnchorElement>, url: string): void {
  event.preventDefault();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return FB.ui({
    display: 'popup',
    method: 'share',
    href: url,
  });
}
