import React from 'react';
import Link from 'next/link';
import { isNotNull } from 'option-t/lib/Nullable/Nullable';

import { PublishedDate } from './PublishedDate';
import { formatYYMMDDString, formatISOString } from '../entry/date';
import { EntryValue } from '../entry/entryValue';

import styles from './EntryList.module.css';

interface Props {
  title: string;
  entries: Array<EntryValue> | null;
}

export const EntryList = ({ title, entries }: Props): JSX.Element =>
  isNotNull(entries) && entries.length >= 1 ? (
    <>
      <h2 className={styles['entry-list-title']}>{title}</h2>
      <ol className={styles['entry-list']}>
        {entries.map((entry) => {
          const { excerpt, id, title, createdAt } = entry;
          const dateTime = formatISOString(createdAt);
          const timeValue = formatYYMMDDString(createdAt);

          return (
            <li className={styles.entry} key={id}>
              <p className={styles['entry-title']}>
                <Link href="/entry/[id]" as={`/entry/${id}`} passHref>
                  <a>{title}</a>
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
    <p>記事はありません。</p>
  );
