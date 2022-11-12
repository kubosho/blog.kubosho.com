import React, { useEffect } from 'react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';
import { isNotUndefined } from 'option-t/lib/Undefinable/Undefinable';

import { EntryValue } from '../../entry/entry_value';
import { SITE_URL } from '../../constants/site_data';
import { PublishedDate } from '../../components/PublishedDate';
import { formatYYMMDDString, formatISOString } from '../../entry/date';
import { SnsShare } from '../../components/SnsShare';
import { addSiteTitleToSuffix } from '../../site_title_inserter';
import { getEntry, getEntrySlugList, getEntryListByCategory, getEntryListByTag } from '../../entry/entry_gateway';
import { createBlogPostingStructuredData } from '../../structured_data/blog_posting_structured_data';
import { getRelatedEntryList } from '../../entry/related_entry_list';
import { retrieveTranslation } from '../../locales/i18n';
import { EntryList } from '../../components/EntryList';
import { pathList } from '../../constants/path_list';

import styles from './entries.module.css';
import contentsChildrenStyles from './contentsChildren.module.css';

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
  relatedEntries: EntryValue[];
}

const Entry = (props: Props): JSX.Element => {
  const { entry, relatedEntries } = props;

  const { slug, title, body, excerpt, tags, publishedAt } = entry;
  const webSiteTitle = retrieveTranslation('website.title');
  const pageTitle = addSiteTitleToSuffix(title);
  const pageUrl = `${SITE_URL}${pathList.entries}/${slug}`;
  const dateTime = formatISOString(publishedAt);
  const timeValue = formatYYMMDDString(publishedAt);
  const structuredData = JSON.stringify(createBlogPostingStructuredData(entry));

  useEffect(() => {
    if (isNotUndefined(window.twttr)) {
      window.twttr.widgets.load();
    }
  }, []);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={excerpt} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={excerpt} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <link rel="canonical" href={pageUrl} />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://platform.twitter.com" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="" />
        <link rel="preconnect" href="https://platform.twitter.com" crossOrigin="" />
      </Head>
      <Script src="https://connect.facebook.net/en_US/sdk.js" defer />
      <Script src="https://platform.twitter.com/widgets.js" defer />
      <article className={styles.entry}>
        <header className={styles.header}>
          <h1 className={styles['entry-title']}>{title}</h1>
          <div className={styles['entry-metadata']}>
            <span className={styles['entry-published-date']}>
              <PublishedDate dateTime={dateTime}>{timeValue}</PublishedDate>
            </span>
            {tags.length > 0 && (
              <ul className={styles['entry-tag-list']}>
                {tags.map((tag, i) => (
                  <li className={styles['entry-tag-list-item']} key={`${tag}_${i}`}>
                    <Link href="/tags/[tag]" as={`/tags/${tag}`}>
                      {tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>
        <div className={styles['entry-contents']}>
          <div
            className={contentsChildrenStyles['entry-contents-children']}
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </div>
        <div className={styles['entry-share']}>
          <p className={styles['entry-share-text']}>{retrieveTranslation('entry.share')}</p>
          <SnsShare title={webSiteTitle} text={title} url={pageUrl} />
        </div>
      </article>
      {relatedEntries.length > 0 && (
        <div className={styles['related-entry-list']}>
          <EntryList title={retrieveTranslation('entry.headings.related')} entries={relatedEntries} />
        </div>
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
    </>
  );
};

export async function getStaticPaths(): Promise<{
  paths: { params: { [id: string]: string } }[];
  fallback: boolean;
}> {
  const entrySlugList = await getEntrySlugList();
  const paths = entrySlugList.map((id) => ({
    params: { id },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }: GetStaticPropsContext): Promise<{ props: Props }> {
  const entryId = `${params.id}`;
  const entry = await getEntry(entryId);

  const entryListByCategory = (await Promise.all(entry.categories.map(getEntryListByCategory))).flat();
  const entryListByTag = (await Promise.all(entry.tags.map(getEntryListByTag))).flat();
  const relatedEntryList = getRelatedEntryList(entryId, entryListByCategory, entryListByTag);

  return {
    props: {
      entry,
      relatedEntries: relatedEntryList,
    },
  };
}

export default Entry;
