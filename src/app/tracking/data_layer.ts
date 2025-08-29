import { getBrowsingContextWindowProxy } from '../global_object/window';

declare global {
  interface Window {
    dataLayer?: Array<unknown>;
  }
}

export const initialDatalayer = (): void => {
  const win = getBrowsingContextWindowProxy();
  if (win === null) {
    return;
  }

  win.dataLayer = [];
  win.dataLayer.push({
    'gtm.start': Date.now(),
    event: 'gtm.js',
  });
};
