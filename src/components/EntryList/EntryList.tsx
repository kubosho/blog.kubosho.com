import React from 'react';
import Link from 'next/link';

import { formatYYMMDDString, formatISOString } from '../../entry/date';
import { EntryValue } from '../../entry/entry_value';
import { retrieveTranslation } from '../../locales/i18n';
import { PublishedDate } from '../PublishedDate';

import styles from './EntryList.module.css';

interface Props {
  entries: EntryValue[] | null;
  pickupEntry?: EntryValue;
  title?: string;
}

function PickupEntry({ entry }: { entry: EntryValue }): JSX.Element {
  const { excerpt, slug, title, publishedAt } = entry;
  const dateTime = formatISOString(publishedAt);
  const timeValue = formatYYMMDDString(publishedAt);

  return (
    <section className={styles['pickup-entry']}>
      <h2 className={styles['pickup-entry-title']}>{retrieveTranslation('top.latestEntry')}</h2>
      <p className={styles['entry-title']}>
        <Link href="/entries/[id]" as={`/entries/${slug}`}>
          {title}
        </Link>
      </p>
      <span className={styles['entry-published-date']}>
        <PublishedDate dateTime={dateTime}>{timeValue}</PublishedDate>
      </span>
      <p className={styles.excerpt} dangerouslySetInnerHTML={{ __html: excerpt }} />
    </section>
  );
}

export const EntryList = ({ pickupEntry, entries, title }: Props): JSX.Element =>
  entries !== null && entries.length > 0 ? (
    <>
      {!pickupEntry ? null : <PickupEntry entry={pickupEntry} />}
      <section>
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
      </section>
    </>
  ) : (
    <p>{retrieveTranslation('components.entryList.notFound')}</p>
  );
