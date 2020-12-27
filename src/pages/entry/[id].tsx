import React, { useEffect } from 'react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { isNotUndefined } from 'option-t/lib/Undefinable/Undefinable';

import { EntryValue } from '../../entry/entryValue';
import { SITE_URL } from '../../constants/site_data';
import { PublishedDate } from '../../components/PublishedDate';
import { formatYYMMDDString, formatISOString } from '../../entry/date';
import { SnsShare } from '../../entry/components/SnsShare';
import { SiteContents } from '../../components/SiteContents';
import { addSiteTitleToSuffix } from '../../site_title_inserter';
import { getEntry, getEntryIdList } from '../../entry/entryGateway';

import styles from './entry.module.css';

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: () => void;
      };
    };
  }
}

interface Props {
  entry: EntryValue;
}

const Entry = (props: Props): JSX.Element => {
  const { id, title, body, excerpt, tags, createdAt } = props.entry;
  const pageTitle = addSiteTitleToSuffix(title);
  const pageUrl = `${SITE_URL}/entry/${id}`;
  const dateTime = formatISOString(createdAt);
  const timeValue = formatYYMMDDString(createdAt);

  useEffect(() => {
    if (isNotUndefined(window.twttr)) {
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta property="og:title" content={pageTitle} />
        <meta name="description" content={excerpt} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://platform.twitter.com" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="" />
        <link rel="preconnect" href="https://platform.twitter.com" crossOrigin="" />
        <script defer src="https://connect.facebook.net/en_US/sdk.js" />
        <script defer src="https://platform.twitter.com/widgets.js" />
      </Head>
      <SiteContents>
        <article className={styles.entry}>
          <header className={styles.header}>
            <h1 className={styles['entry-title']}>{title}</h1>
            <PublishedDate dateTime={dateTime}>{timeValue}</PublishedDate>
          </header>
          <div className={`entry-contents ${styles['entry-contents']}`} dangerouslySetInnerHTML={{ __html: body }} />
          <footer className={styles['entry-footer']}>
            <SnsShare shareText={pageTitle} />
            {tags.length >= 1 && (
              <ul className={styles['entry-tag-list']}>
                {tags.map((tag, i) => (
                  <li className={styles['entry-tag-list-item']} key={`${tag}_${i}`}>
                    <Link href="/tags/[tag]" as={`/tags/${tag}`} passHref>
                      <a className={styles['entry-tag-link']}>{tag}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </footer>
        </article>
      </SiteContents>
    </>
  );
};

export async function getStaticPaths(): Promise<{
  paths: { params: { [id: string]: string } }[];
  fallback: boolean;
}> {
  const entryIdList = await getEntryIdList();
  const paths = entryIdList.map((id) => ({
    params: { id },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: GetStaticPropsContext): Promise<{ props: Props }> {
  const entry = await getEntry(`${params.id}`);

  return {
    props: {
      entry,
    },
  };
}

export default Entry;
