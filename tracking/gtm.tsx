import React from 'react';

export const PRODUCTION_GTM_ID = 'GTM-WQNTM9W';
export const DEVELOPMENT_GTM_ID = 'GTM-5FH7ZXN';

export function insertGtmScript(id: string): JSX.Element {
  let globalObject = null;

  try {
    globalObject = window;
  } catch (_err) {
    globalObject = global;
  }

  return runGtm(globalObject, 'dataLayer', id);
}

function runGtm(win, dataLayer, id): JSX.Element {
  win.dataLayer = win.dataLayer || [];

  win[dataLayer].push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  return <script src={`https://www.googletagmanager.com/gtm.js?id=${id}`} async />;
}
