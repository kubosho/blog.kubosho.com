import React from 'react';
import App, { Container } from 'next/app';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';

import { SITE_TITLE } from '../constants';
import { BACKGROUND_COLOR, MAIN_COLOR, TEXT_COLOR } from '../common_styles/color';
import { BASE_FONT_SIZE, FONT_FAMILY, LINE_HEIGHT, PROGRAMMING_FONT_FAMILY } from '../common_styles/text';
import { SPACE } from '../common_styles/space';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${BACKGROUND_COLOR};
    color: ${TEXT_COLOR};
    font-family: ${FONT_FAMILY};
    font-weight: 500;
    font-feature-settings: 'palt';
    text-rendering: optimizeLegibility;
    font-size: ${BASE_FONT_SIZE};
    line-height: ${LINE_HEIGHT};
  }

  code {
    padding: 0 ${SPACE};
    border: 1px dotted ${MAIN_COLOR};
    font-family: ${PROGRAMMING_FONT_FAMILY};
  }

  pre code {
    padding: 0;
    border: none;
  }
`;

export default class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props;

    return (
      <Container>
        <Head>
          <meta name="theme-color" content={MAIN_COLOR} />
          <link rel="apple-touch-icon" href="/static/images/icon.png" />
          <link rel="icon" type="image/png" href="/static/images/icon.png" />
          <link rel="stylesheet" href="/static/styles/foundation.css" />
          <link rel="alternate" type="application/rss+xml" href="/feed" title={SITE_TITLE} />
        </Head>
        <GlobalStyle />
        <Component {...pageProps} />
      </Container>
    );
  }
}
