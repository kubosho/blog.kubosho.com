import { GA_TRACKING_ID } from '../constants';

declare global {
  interface Window {
    gtag: (configName: string, id: string, option: { page_location: string }) => void;
  }
}

export function trackPageView(pathname: string): void {
  try {
    window.gtag('config', `${GA_TRACKING_ID}`, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      page_location: pathname,
    });
  } catch (error) {
    // silences the error in dev mode
    // and/or if gtag fails to load
  }
}
