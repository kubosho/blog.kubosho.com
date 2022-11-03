import React from 'react';
import Link from 'next/link';

import { formatYYMMDDString, formatISOString } from '../../entry/date';
import { EntryValue } from '../../entry/entry_value';
import { retrieveTranslation } from '../../locales/i18n';
import { PublishedDate } from '../PublishedDate';

import styles from './EntryList.module.css';

interface Props {
  entries: EntryValue[] | null;
  title?: string;
}

export const EntryList = ({ title, entries }: Props): JSX.Element =>
  entries !== null && entries.length > 0 ? (
    <>
      {!title ? null : <h2 className={styles['entry-list-title']}>{title}</h2>}
      <ol className={styles['entry-list']}>
        {entries.map((entry) => {
          const { excerpt, slug, title, publishedAt } = entry;
          const dateTime = formatISOString(publishedAt);
          const timeValue = formatYYMMDDString(publishedAt);

          return (
            <li className={styles.entry} key={slug}>
              <p className={styles['entry-title']}>
                <Link href="/entries/[id]" as={`/entries/${slug}`}>
                  {title}
                </Link>
              </p>
              <span className={styles['entry-published-date']}>
                <PublishedDate dateTime={dateTime}>{timeValue}</PublishedDate>
              </span>
              <p className={styles.excerpt} dangerouslySetInnerHTML={{ __html: excerpt }} />
            </li>
          );
        })}
      </ol>
    </>
  ) : (
    <p>{retrieveTranslation('components.entryList.notFound')}</p>
  );
