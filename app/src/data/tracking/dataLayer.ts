import { getBrowsingContextWindowProxy } from '../../utils/global_object/window';

declare global {
  interface Window {
    dataLayer?: Array<unknown>;
  }
}

export type TrackingEvent = {
  event: string;
  [key: string]: unknown;
};

export const pushEvent = (eventData: TrackingEvent): void => {
  const win = getBrowsingContextWindowProxy();
  win?.dataLayer?.push(eventData);
};

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
