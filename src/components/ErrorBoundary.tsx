import React from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function activateErrorBoundaryComponent(apiKey: string): any {
  Bugsnag.start({
    apiKey,
    plugins: [new BugsnagPluginReact(React)],
  });

  return Bugsnag.getPlugin('react');
}
