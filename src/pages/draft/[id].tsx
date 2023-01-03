import { ParsedUrlQuery } from 'querystring';

import { useEffect } from 'react';
import { GetStaticProps, PreviewData } from 'next';
import Head from 'next/head';
import Script from 'next/script';
import Link from 'next/link';

import { EntryValue } from '../../entry/entry_value';
import { getApiResponse } from '../../microcms_api/api_response';
import { BlogApiSchema } from '../../microcms_api/api_schema';
import { getRequestOptions } from '../../microcms_api/request_options';
import { addSiteTitleToSuffix } from '../../site_title_inserter';
import { PublishedDate } from '../../components/PublishedDate';
import { formatISOString, formatYYMMDDString } from '../../entry/date';
import { mapEntryValue } from '../../entry/entry_converter';
import { getEntryIdList } from '../../entry/entry_gateway';
import { retrieveTranslation } from '../../locales/i18n';
import { pathList } from '../../constants/path_list';
import styles from '../entries/entries.module.css';

type CustomPreviewData = {
  draftKey: string;
} & PreviewData;

type EntryResponse = BlogApiSchema;

type Props = {
  entry: EntryValue | null;
};

const Draft = (props: Props): JSX.Element => {
  useEffect(() => {
    if (!window.twttr) {
      return;
    }

    window.twttr.widgets.load();
  }, []);

  const { entry } = props;
  if (!entry) {
    return (
      <div className={styles['entry-contents']}>
        <p>{retrieveTranslation('draft.notAvailable')}</p>
      </div>
    );
  }

  const { title, body, excerpt, tags, publishedAt } = entry;
  const pageTitle = addSiteTitleToSuffix(title);
  const dateTime = formatISOString(publishedAt);
  const timeValue = formatYYMMDDString(publishedAt);

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={excerpt} />
        <link rel="dns-prefetch" href="https://platform.twitter.com" />
        <link rel="preconnect" href="https://platform.twitter.com" crossOrigin="" />
      </Head>
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
                    <Link href={`${pathList.tags}/${tag}`}>{tag}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </header>
        <div className={styles['entry-contents']} dangerouslySetInnerHTML={{ __html: body }} />
      </article>
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

  const apiPath = `/${id}`;
  const query = `?${draftKeyQuery}`;
  const options = getRequestOptions({ apiPath, query });

  try {
    const res = await getApiResponse<EntryResponse>(options);
    const entry = await mapEntryValue(res);

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
