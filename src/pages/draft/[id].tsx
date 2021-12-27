import React, { useEffect } from 'react';
import { GetStaticProps, PreviewData } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { isNotUndefined } from 'option-t/lib/Undefinable/Undefinable';
import { EntryValue } from '../../entry/entryValue';
import { getApiResponse } from '../../microcms_api/api_response';
import { BlogApiSchema } from '../../microcms_api/api_schema';
import { mapBlogApiSchemaToEntryValueParameter } from '../../microcms_api/api_schema_to_entry_value_parameter';
import { getRequestOptions } from '../../microcms_api/request_options';
import { SiteContents } from '../../components/SiteContents';
import { addSiteTitleToSuffix } from '../../site_title_inserter';
import { SITE_URL } from '../../constants/site_data';
import { SnsShare } from '../../components/SnsShare';
import { PublishedDate } from '../../components/PublishedDate';
import { formatISOString, formatYYMMDDString } from '../../entry/date';
import { mapEntryValue } from '../../entry/entryConverter';
import { getEntryIdList } from '../../entry/entryGateway';

import styles from '../entry/entry.module.css';
import entryContentsChildrenStyles from '../entry/entryContentsChildren.module.css';

type CustomPreviewData = {
  draftKey: string;
} & PreviewData;

type EntryResponse = BlogApiSchema;

type Props = {
  entry: EntryValue | null;
};

const Draft = (props: Props): JSX.Element => {
  useEffect(() => {
    if (isNotUndefined(window.twttr)) {
      window.twttr.widgets.load();
    }
  }, []);

  const { entry } = props;
  if (!entry) {
    return (
      <SiteContents>
        <div className={entryContentsChildrenStyles['entry-contents']}>
          <p>プレビューは利用できません。</p>
        </div>
      </SiteContents>
    );
  }

  const { slug, title, body, excerpt, tags, publishedAt } = entry;
  const pageTitle = addSiteTitleToSuffix(title);
  const pageUrl = `${SITE_URL}/entry/${slug}`;
  const dateTime = formatISOString(publishedAt);
  const timeValue = formatYYMMDDString(publishedAt);

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
            </div>
          </header>
          <div className={entryContentsChildrenStyles['entry-contents']} dangerouslySetInnerHTML={{ __html: body }} />
          <div className={styles['entry-share']}>
            <p className={styles['entry-share-text']}>記事を共有する</p>
            <SnsShare shareText={pageTitle} />
          </div>
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

  return { paths, fallback: true };
}

export const getStaticProps: GetStaticProps<unknown, ParsedUrlQuery, CustomPreviewData> = async (context) => {
  const id = context.params?.id;
  const draftKey = context.previewData?.draftKey;
  const draftKeyQuery = draftKey !== undefined ? `draftKey=${draftKey}` : '';
  const path = `https://${process.env.X_MICROCMS_HOST_NAME}/${process.env.X_MICROCMS_API_PATH}/${id}?${draftKeyQuery}`;
  const options = getRequestOptions({ path });

  try {
    const res = await getApiResponse<EntryResponse>(options);
    const entry = await mapEntryValue(mapBlogApiSchemaToEntryValueParameter(res));

    return {
      props: {
        entry: JSON.parse(JSON.stringify(entry)),
      },
    };
  } catch (err) {
    console.error(err);

    return {
      props: {
        entry: null,
      },
    };
  }
};

export default Draft;
