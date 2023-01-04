import * as React from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact, { BugsnagErrorBoundary } from '@bugsnag/plugin-react';

let isBugsnagStarted = false;
let ErrorBoundary = null;

export function activateErrorBoundaryComponent(apiKey: string): BugsnagErrorBoundary {
  const plugins = [new BugsnagPluginReact(React)];

  if (!isBugsnagStarted) {
    Bugsnag.start({
      apiKey,
      plugins,
    });

    ErrorBoundary = Bugsnag.getPlugin('react').createErrorBoundary(React);
    isBugsnagStarted = true;
  }

  return ErrorBoundary;
}
