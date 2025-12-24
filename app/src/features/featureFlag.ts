import type { AstroCookies } from 'astro';

import { type FeatureFlagKey, featureFlags } from '../../constants/featureFlags';

export function isFeatureEnabled(flagName: FeatureFlagKey, cookies?: AstroCookies): boolean {
  const defaultValue = featureFlags[flagName];
  if (cookies == null) {
    return defaultValue;
  }

  const cookieKey = `feature_${flagName}`;
  const cookieValue = cookies.get(cookieKey);

  if (cookieValue?.value === 'true') {
    return true;
  }

  return false;
}
