import Bugsnag from '@bugsnag/js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function activateErrorBoundaryComponent(): any {
  return Bugsnag.getPlugin('react');
}
