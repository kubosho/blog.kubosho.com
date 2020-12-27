import React, { ReactNode } from 'react';
import styles from './SiteContents.module.css';

interface Props {
  children?: ReactNode;
}

export const SiteContents = ({ children }: Props): JSX.Element => (
  <main className={styles['site-contents']}>{children}</main>
);
