import React from 'react';

import { FacebookLink } from '../FacebookLink';
import { TwitterLink } from '../TwitterLink';

import styles from './SnsShare.module.css';

type Props = {
  text: string;
  title: string;
  url: string;
};

export const SnsShare = ({ text, title, url }: Props): JSX.Element => (
  <ul className={styles['sns-link-list']}>
    <li>
      <TwitterLink text={text} title={title} url={url} />
    </li>
    <li>
      <FacebookLink url={url} />
    </li>
  </ul>
);
