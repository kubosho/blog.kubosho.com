import { createGlobalStyle } from 'styled-components';
import { ACCENT_COLOR, CODE_BACKGROUND_COLOR, MAIN_COLOR, TEXT_COLOR_LIGHT } from '../../common_styles/color';
import { CONTENTS_SEPARATOR_SPACE, SPACE } from '../../common_styles/space';

export const EntryContentsStyle = createGlobalStyle`
  blockquote, p, pre, ol, ul {
    margin: calc(1rem + ${SPACE}) 0;
  }

  blockquote {
    position: relative;
    padding: ${SPACE} calc(1rem + ${SPACE});
    border: 1px solid ${ACCENT_COLOR};
  }

  blockquote > p {
    margin: 0;
  }

  blockquote::before,
  blockquote::after {
    position: absolute;
    height: 0;
    color: ${MAIN_COLOR};
    font-size: 3rem;
    font-weight: 900;
    line-height: 1;
  }

  blockquote::before {
    content: '❝';
    top: 0.3rem;
    right: calc(100% - 1.25rem);
  }

  blockquote::after {
    content: '❞';
    bottom: 2rem;
    left: calc(100% - 1.25rem);
  }

  h2 {
    margin: calc(${CONTENTS_SEPARATOR_SPACE} / 2) 0 0;
  }

  h3 {
    margin: calc(${CONTENTS_SEPARATOR_SPACE} / 3) 0 0;
  }

  h4 {
    margin: calc(${CONTENTS_SEPARATOR_SPACE} / 4) 0 0;
  }

  img {
    max-width: 100%;
  }

  pre {
    padding: calc(${SPACE} * 2);
    background-color: ${CODE_BACKGROUND_COLOR};
    color: ${TEXT_COLOR_LIGHT};
    overflow: auto;
  }

  pre > code {
    white-space: pre-wrap;
  }

  ol ol,
  ul ul {
    margin: calc((1rem + ${SPACE}) / 2) 0;
  }

  .twitter-tweet {
    width: auto !important;
  }
`;
