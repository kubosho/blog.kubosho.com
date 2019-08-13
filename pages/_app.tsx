import React from 'react';
import App, { Container } from 'next/app';
import { createGlobalStyle } from 'styled-components';
import { TEXT_COLOR } from '../common_styles/text';

const GlobalStyle = createGlobalStyle`
  body {
    color: ${TEXT_COLOR};
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
