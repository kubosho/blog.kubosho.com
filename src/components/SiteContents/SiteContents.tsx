import React, { ReactNode } from 'react';
import styles from './SiteContents.module.css';

interface Props {
  children?: ReactNode;
}

export const SiteContents = ({ children }: Props): JSX.Element => (
  <main className={styles['web-site-contents']}>{children}</main>
);
