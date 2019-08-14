import React from 'react';
import App, { Container } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import { TEXT_COLOR } from '../common_styles/color';

/*
  viewport width:
  - 320px => 16px
  - 1366px => 17.3075px
  - 1920px => 18px
  - 3840px => 20.4px
*/
const BASE_FONT_SIZE = 'calc((100vw - 320px) / 800 + 1rem)';
const GlobalStyle = createGlobalStyle`
  body {
    color: ${TEXT_COLOR};
    font-size: ${BASE_FONT_SIZE};
  }
`;

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <GlobalStyle />
        <Component {...pageProps} />
      </Container>
    );
  }
}
