import React from 'react';
import App, { Container } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import { TEXT_COLOR } from '../common_styles/color';
import { BASE_FONT_SIZE, LINE_HEIGHT } from '../common_styles/text';

/*
  viewport width:
  - 320px => 16px
  - 1366px => 17.3075px
  - 1920px => 18px
  - 3840px => 20.4px
*/
const GlobalStyle = createGlobalStyle`
  body {
    color: ${TEXT_COLOR};
    font-size: ${BASE_FONT_SIZE};
    line-height: ${LINE_HEIGHT};
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
