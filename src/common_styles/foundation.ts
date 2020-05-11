import { createGlobalStyle } from 'styled-components';

import { BACKGROUND_COLOR, MAIN_COLOR, TEXT_COLOR } from '../common_styles/color';
import { BASE_FONT_SIZE, FONT_FAMILY, LINE_HEIGHT, PROGRAMMING_FONT_FAMILY } from '../common_styles/text';
import { SPACE } from '../common_styles/space';

export const FoundationStyles = createGlobalStyle`
  /*!
   * foundation.css • v1.0.0
   */

  /* Global elements
  ========================================================================== */

  /**
   * 1. (opinionated) Prevent padding and border from affecting element width.
   *   - https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/
   *   - in all browsers
   * 2. (opinionated) Change the default font family.
   *   - in all browsers
   * 3. Prevent adjustments of font size after orientation changes.
   *   - in iOS
   */
  html {
    box-sizing: border-box; /* 1 */
    font-family: sans-serif; /* 2 */
    -webkit-text-size-adjust: 100%; /* 3 */
  }

  /**
   * (opinionated) Prevent padding and border from affecting element width.
   *   - https://css-tricks.com/inheriting-box-sizing-probably-slightly-better-best-practice/
   *   - in all browsers
   */
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  /* General elements
  ========================================================================== */

  /**
   * (opinionated) Remove the margin.
   *   - in all browsers
   */
  body {
    margin: 0;
  }

  /* Form elements
  ========================================================================== */

  /**
   * 1. (opinionated) Change font properties to 'inherit'.
   *   - in all browsers
   * 2. Remove the margin.
   *   - in Firefox and Safari
   */
  button,
  input,
  select,
  textarea {
    font: inherit; /* 1 */
    margin: 0; /* 2 */
  }

  /**
   * Remove the inheritance of text transform.
   *   - in Firefox 40+, IE 11-, and Edge
   */
  button,
  select {
    text-transform: none;
  }

  /**
   * (opinionated) Change the cursor to button elements.
   *   - in all browsers
   */
  button,
  [type='button'],
  [type='submit'] {
    cursor: pointer;
  }

  /**
   * Restore the default cursor to disabled elements unset by the previous rule.
   *   - in all browsers
   */
  [disabled] {
    cursor: default;
  }

  /*!
   * This Web site specific CSS
   */

  html {
    overflow-x: hidden;
  }

  body {
    background-color: ${BACKGROUND_COLOR};
    color: ${TEXT_COLOR};
    font-family: ${FONT_FAMILY};
    font-weight: 500;
    font-feature-settings: 'palt';
    text-rendering: optimizeLegibility;
    font-size: ${BASE_FONT_SIZE};
    line-height: ${LINE_HEIGHT};
    overflow: hidden;
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
