import React from 'react';
import Link from 'next/link';
import { isNotNull } from 'option-t/lib/Nullable/Nullable';

import { PublishedDate } from './PublishedDate';
import { formatYYMMDDString, formatISOString } from '../entry/date';
import { EntryValue } from '../entry/entry_value';

import styles from './EntryList.module.css';
import { retrieveTranslation } from '../locales/i18n';

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
          const { excerpt, slug, title, publishedAt } = entry;
          const dateTime = formatISOString(publishedAt);
          const timeValue = formatYYMMDDString(publishedAt);

          return (
            <li className={styles.entry} key={slug}>
              <p className={styles['entry-title']}>
                <Link href="/entry/[id]" as={`/entry/${slug}`} passHref>
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
    <p>{retrieveTranslation('components.entryList.notFound')}</p>
  );
