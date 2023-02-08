import { TWITTER_ACCOUNT_ID } from '../../../constants/site_data';
import { SnsShareUrl } from '../../../constants/sns_share_url';
import { TwitterIcon } from '../Icon/TwitterIcon';

import styles from './TwitterLink.module.css';

type Props = {
  text: string;
  title: string;
  url: string;
};

export const TwitterLink = ({ text, title, url }: Props): JSX.Element => {
  const shareUrl = `${SnsShareUrl.Twitter}?url=${url}&text=${text} / ${title}&via=${TWITTER_ACCOUNT_ID}&related=${TWITTER_ACCOUNT_ID}`;

  return (
    <a className={styles['twitter-link']} href={shareUrl} rel="noopener noreferrer" target="_blank">
      <TwitterIcon />
    </a>
  );
};
