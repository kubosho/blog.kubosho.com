/*
  viewport width:
  - 320px => 16px
  - 1366px => 17.3075px
  - 1920px => 18px
  - 3840px => 20.4px
*/
export const BASE_FONT_SIZE = 'calc((100vw - 320px) / 800 + 1rem)';
export const LARGE_FONT_SIZE = `calc(${BASE_FONT_SIZE} * 1.25)`;
export const FONT_FAMILY = "'Hiragino Sans', '游ゴシック', Helvetica, sans-serif";
export const PROGRAMMING_FONT_FAMILY = 'Menlo, Consolas, Monaco, monospace';
export const LINE_HEIGHT = 1.5;

export const NOTE_FONT_SIZE = '0.875rem';
