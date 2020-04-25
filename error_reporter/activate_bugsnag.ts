import React from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

let isActivatedBugsnag = false;

export function activateBugsnag(apiKey: string): void {
  if (isActivatedBugsnag) {
    return;
  }

  Bugsnag.start({
    apiKey,
    plugins: [new BugsnagPluginReact(React)],
  });

  isActivatedBugsnag = true;
}
