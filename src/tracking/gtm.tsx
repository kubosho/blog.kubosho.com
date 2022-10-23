import React from 'react';

import { getBrowsingContextWindowProxy } from '../global_object/window';

declare global {
  interface Window {
    dataLayer?: Array<unknown>;
  }
}

export function insertGtmScript(id: string): JSX.Element {
  setDataToGtmDataLayer({
    'gtm.start': Date.now(),
    event: 'gtm.js',
  });
  return <script src={`https://www.googletagmanager.com/gtm.js?id=${id}`} async />;
}

export function insertGtmNoscript(id: string): JSX.Element {
  return (
    <noscript>
      <iframe
        title=""
        src={`https://www.googletagmanager.com/ns.html?id=${id}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
        loading="eager"
      />
    </noscript>
  );
}

export function setDataToGtmDataLayer(param: unknown): void {
  const win = getBrowsingContextWindowProxy();

  if (win === null) {
    return;
  }

  win.dataLayer = win.dataLayer || [];
  win.dataLayer.push(param);
}
