import React, { ReactNode, TimeHTMLAttributes } from 'react';

import styles from './PublishedDate.module.css';

interface Props {
  children?: ReactNode;
}

export const PublishedDate = ({ children }: TimeHTMLAttributes<Props>): JSX.Element => (
  <time className={styles['published-date']}>{children}</time>
);
