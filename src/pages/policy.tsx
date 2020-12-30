import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';

import { SITE_TITLE, SITE_URL } from '../constants/site_data';
import { createGAOptout } from '../tracking/ga_optout';
import { GTM_ID } from '../tracking/gtm_id';
import { SiteContents } from '../components/SiteContents';
import { addSiteTitleToSuffix } from '../site_title_inserter';
import { PathList } from '../constants/path_list';

import styles from './policy.module.css';

enum OptoutActionText {
  Enabled = 'オプトアウトの有効化',
  Disabled = 'オプトアウトの無効化',
}

enum OptoutStatusMessage {
  Enabled = 'オプトアウトが有効になっています。<br>Googleアナリティクスによるアクセス解析はおこなわれません。',
  Disabled = 'オプトアウトが無効になっています。<br>Googleアナリティクスによるアクセス解析がおこなわれます。',
}

const optout = createGAOptout(GTM_ID);

const PolicyPage = (): JSX.Element => {
  const pageTitle = 'ポリシー';
  const pageUrl = `${SITE_URL}${PathList.Policy}`;
  const titleInHead = addSiteTitleToSuffix(pageTitle);

  const [isEnabledOptout, setIsEnabledOptout] = useState(false);

  useEffect(() => {
    setIsEnabledOptout(optout.enabled());
  }, []);

  const onClickOptoutButton = useCallback(() => {
    if (optout.enabled()) {
      setIsEnabledOptout(false);
      optout.disable();
    } else {
      setIsEnabledOptout(true);
      optout.enable();
    }
  }, [optout, setIsEnabledOptout]);

  return (
    <React.Fragment>
      <Head>
        <title>{titleInHead}</title>
        <meta property="og:title" content={titleInHead} />
        <meta property="og:url" content={pageUrl} />
      </Head>
      <SiteContents>
        <article className={styles.entry}>
          <h2 className={styles.title}>{pageTitle}</h2>
          <p>このページでは当ブログ『{SITE_TITLE}』内で適用されるポリシーについて書きます。</p>
          <h3 className={styles['sub-title']}>プライバシー</h3>
          <div className={styles['entry-contents']}>
            <p>当ブログでは内容の改善を目的として、Googleアナリティクスによるアクセス分析をおこなっています。</p>
            <p>
              Googleアナリティクスは、Cookie(クッキー)により、匿名のトラフィックデータを収集しています。
              <br />
              Cookieに含まれるデータは利用者の個人情報を特定しません。利用者はCookieを無効にした状態で当ブログにアクセスできます。
            </p>
            <p>
              詳しくはGoogleが公開している
              <a href="https://policies.google.com/technologies/partner-sites">
                Google のサービスを使用するサイトやアプリから収集した情報の Google による使用
              </a>
              のページを参照してください。
            </p>
          </div>
          <h4 className={styles['sub-title']}>Googleアナリティクスによる解析のオプトアウト</h4>
          <p>以下のボタンからGoogleアナリティクスによる解析のオプトアウトの有効化・無効化がおこなえます。</p>
          <button type="button" onClick={onClickOptoutButton}>
            {isEnabledOptout ? OptoutActionText.Disabled : OptoutActionText.Enabled}
          </button>
          <p>
            <output
              dangerouslySetInnerHTML={{
                __html: isEnabledOptout ? OptoutStatusMessage.Enabled : OptoutStatusMessage.Disabled,
              }}
            />
          </p>
        </article>
      </SiteContents>
    </React.Fragment>
  );
};

export default PolicyPage;
