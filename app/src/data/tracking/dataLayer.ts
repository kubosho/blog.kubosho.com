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

// Reset properties not included in the current event to prevent
// GTM dataLayer state from leaking between different event types.
const defaultProperties: Record<string, undefined> = {
  share_platform: undefined,
  entry_id: undefined,
  entry_title: undefined,
};

export const pushEvent = (eventData: TrackingEvent): void => {
  const win = getBrowsingContextWindowProxy();
  win?.dataLayer?.push({ ...defaultProperties, ...eventData });
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
