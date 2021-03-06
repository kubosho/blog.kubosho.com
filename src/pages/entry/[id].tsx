import React, { useEffect } from 'react';
import { GetStaticPropsContext } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { isNotUndefined } from 'option-t/lib/Undefinable/Undefinable';

import { EntryValue } from '../../entry/entryValue';
import { SITE_URL } from '../../constants/site_data';
import { PublishedDate } from '../../components/PublishedDate';
import { formatYYMMDDString, formatISOString } from '../../entry/date';
import { SnsShare } from '../../components/SnsShare';
import { SiteContents } from '../../components/SiteContents';
import { addSiteTitleToSuffix } from '../../site_title_inserter';
import { getEntry, getEntryIdList, getEntryListByTag } from '../../entry/entryGateway';
import { createBlogPostingStructuredData } from '../../structured_data/blog_posting_structured_data';

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
  relatedEntryList: Pick<EntryValue, 'id' | 'title'>[];
}

const Entry = (props: Props): JSX.Element => {
  const { entry, relatedEntryList } = props;

  const structuredData = JSON.stringify(createBlogPostingStructuredData(entry));
  const { id, title, body, excerpt, categories, tags, createdAt } = entry;
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
            <div className={styles['entry-metadata']}>
              <span className={styles['entry-published-date']}>
                <PublishedDate dateTime={dateTime}>{timeValue}</PublishedDate>
              </span>
              {categories.length > 0 && (
                <ul className={styles['entry-category-list']}>
                  {categories.map((category, i) => (
                    <li className={styles['entry-category-list-item']} key={`${category}_${i}`}>
                      <Link href="/categories/[category]" as={`/categories/${category}`} passHref>
                        <a className={styles['entry-category-link']}>{category}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </header>
          <div className={styles['entry-contents']} dangerouslySetInnerHTML={{ __html: body }} />
          <footer className={styles['entry-footer']}>
            <SnsShare shareText={pageTitle} />
            {tags.length > 0 && (
              <ul className={styles['entry-tag-list']}>
                {tags.map((tag, i) => (
                  <li className={styles['entry-tag-list-item']} key={`${tag}_${i}`}>
                    <Link href="/tags/[tag]" as={`/tags/${tag}`} passHref>
                      <a>{tag}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </footer>
        </article>
        {relatedEntryList.length > 0 && (
          <section className={styles['related-entry-list']}>
            <h2>関連記事</h2>
            <ul>
              {relatedEntryList.map(({ id, title }) => (
                <li className={styles.entry} key={id}>
                  <Link href="/entry/[id]" as={`/entry/${id}`} passHref>
                    <a>{title}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </SiteContents>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: structuredData }} />
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
  const relatedEntryList = (
    await Promise.all(
      entry.tags
        .map(
          async (tag) =>
            await (await getEntryListByTag(tag))
              .filter((entry) => {
                return entry.id !== params.id;
              })
              .map((entry) => {
                return {
                  id: entry.id,
                  title: entry.title,
                };
              }),
        )
        .filter(async (list) => (await (await list).length) > 0),
    )
  )
    .slice(0, 5)
    .flat();

  return {
    props: {
      entry,
      relatedEntryList,
    },
  };
}

export default Entry;
