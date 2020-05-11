import React from 'react';
import { isNull, Nullable } from 'option-t/lib/Nullable/Nullable';
import { getBrowsingContextWindowProxy } from '../global_object/window';

declare global {
  interface Window {
    dataLayer?: Array<unknown>;
  }
}

export function insertGtmScript(id: string): JSX.Element {
  const globalObject = getBrowsingContextWindowProxy();
  return runGtm(globalObject, id);
}

function runGtm(win: Nullable<Window>, id: string): JSX.Element {
  if (isNull(win)) {
    return null;
  }

  win.dataLayer = win.dataLayer || [];

  win.dataLayer.push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js',
  });

  return <script src={`https://www.googletagmanager.com/gtm.js?id=${id}`} async />;
}
