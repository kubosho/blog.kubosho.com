import React from 'react';
import { MouseEvent } from 'react';

import { FACEBOOK_APP_ID } from '../../constants/site_data';
import { SnsShareUrl } from '../../constants/sns_share_url';
import { FacebookIcon } from '../Icon/FacebookIcon';

import styles from './FacebookLink.module.css';

type Props = {
  url: string;
};

export const FacebookLink = ({ url }: Props): JSX.Element => {
  const shareUrl = `${SnsShareUrl.Facebook}?app_id=${FACEBOOK_APP_ID}&display=page&href=${url}`;

  return (
    <a
      className={styles['facebook-link']}
      href={shareUrl}
      rel="noopener noreferrer"
      target="_blank"
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClickFacebookLink(event, url);
      }}
    >
      <FacebookIcon />
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
