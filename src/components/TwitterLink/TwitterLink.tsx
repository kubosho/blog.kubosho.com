import React from 'react';
import { useRouter } from 'next/router';

import { SITE_URL, TWITTER_ACCOUNT_ID } from '../../constants/site_data';
import { SnsShareUrl } from '../../constants/sns_share_url';
import { TwitterSvg } from '../SnsIcon/Twitter';

import styles from './TwitterLink.module.css';

interface Props {
  shareText: string;
}

export const TwitterLink = ({ shareText }: Props): JSX.Element => {
  const router = useRouter();
  const currentUrl = `${SITE_URL}${router.asPath}`;
  const shareUrl = `${SnsShareUrl.Twitter}?url=${currentUrl}&text=${shareText}&via=${TWITTER_ACCOUNT_ID}&related=${TWITTER_ACCOUNT_ID}`;

  return (
    <a className={styles['twitter-link']} href={shareUrl} rel="noopener noreferrer" target="_blank">
      <TwitterSvg />
    </a>
  );
};
