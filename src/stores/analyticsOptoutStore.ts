import { atom } from 'nanostores';

import { createGAOptout } from '../tracking/ga_optout';
import { GTM_ID } from '../tracking/gtm_id';

export const analyticsOptout = createGAOptout(GTM_ID);
export const analyticsOptoutState = atom(false);

export const setAnalyticsOptoutState = (value: boolean): void => {
  analyticsOptoutState.set(value);
};
