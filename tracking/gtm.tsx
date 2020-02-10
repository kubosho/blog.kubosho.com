import React from 'react';

export function insertGtmScript(): JSX.Element {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
function runGtm(win, doc, dataLayer, id) {
  win.dataLayer = win.dataLayer || [];

  win[dataLayer].push({
    'gtm.start': new Date().getTime(),
    event: 'gtm.js'
  });

  var bs = doc.querySelector('script'),
      cs = doc.createElement('script'),
      dl = dataLayer != 'dataLayer' ? '&l=' + dataLayer : '';
      cs.async = true;
      cs.src = 'https://www.googletagmanager.com/gtm.js?id=' + id + dl;
      bs.parentNode.insertBefore(cs, bs);
}

runGtm(window, document, 'dataLayer', 'GTM-WQNTM9W');
  `,
      }}
    />
  );
}
