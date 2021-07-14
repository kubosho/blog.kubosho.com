import React from 'react';
import { FacebookLink } from './FacebookLink';
import { TwitterLink } from './TwitterLink';

import styles from './SnsShare.module.css';

interface Props {
  shareText: string;
}

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
