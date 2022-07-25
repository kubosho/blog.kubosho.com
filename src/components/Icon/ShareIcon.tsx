import React from 'react';

import { retrieveTranslation } from '../../locales/i18n';

// Font Awesome Free 5.15.4 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License)
// https://github.com/FortAwesome/Font-Awesome/blob/master/js-packages/@fortawesome/fontawesome-free/svgs/solid/share.svg
// License: https://fontawesome.com/license/free
export const ShareIcon = (): JSX.Element => (
  <svg viewBox="0 0 512 512" aria-label={retrieveTranslation('components.icon.share')} role="img">
    <path d="M503.691 189.836L327.687 37.851C312.281 24.546 288 35.347 288 56.015v80.053C127.371 137.907 0 170.1 0 322.326c0 61.441 39.581 122.309 83.333 154.132 13.653 9.931 33.111-2.533 28.077-18.631C66.066 312.814 132.917 274.316 288 272.085V360c0 20.7 24.3 31.453 39.687 18.164l176.004-152c11.071-9.562 11.086-26.753 0-36.328z" />
  </svg>
);