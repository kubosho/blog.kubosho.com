import React, { ReactNode, TimeHTMLAttributes } from 'react';

import styles from './PublishedDate.module.css';

interface Props {
  dateTime: string;
  children?: ReactNode;
}

export const PublishedDate = ({ dateTime, children }: TimeHTMLAttributes<Props>): JSX.Element => (
  <time dateTime={dateTime} className={styles['published-date']}>
    {children}
  </time>
);
