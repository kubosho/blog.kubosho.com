import Document, { Main, NextScript, Head } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import { GA_TRACKING_ID, SITE_TITLE } from '../constants';

type Props = {
  isProduction: boolean;
};

export default class MyDocument extends Document<Props> {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    const isProduction = process.env.NODE_ENV === 'production';

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        isProduction,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    const { isProduction } = this.props;
    return (
      <html lang="ja">
        <Head>
          <meta itemProp="name" content={SITE_TITLE} />
          <meta property="og:site_name" content={SITE_TITLE} />
          <meta property="og:type" content="blog" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@kubosho_" />
        </Head>
        <body>
          {isProduction && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
              <script dangerouslySetInnerHTML={setGATag()} />
            </>
          )}
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}

function setGATag() {
  return {
    __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', ${GA_TRACKING_ID});
      `,
  };
}
