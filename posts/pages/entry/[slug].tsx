import React from 'react';
import { useRouter } from 'next/router';

import entries from '../../data/entries.json';

const Post = (): JSX.Element => {
  const router = useRouter();
  const { slug } = router.query;

  // TODO: Required a computational complexity to less than "O(n)"
  const data = entries.find(entry => entry.slug === slug);
  const { id, title, content } = data;

  const e = (
    <React.Fragment>
      <article className="com-Entry-EntryComponent-article" key={id}>
        <header className="com-Entry-EntryComponent-article__header">
          <h1 className="com-Entry-EntryComponent-article__title">{title}</h1>
        </header>
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </article>
    </React.Fragment>
  );

  return e;
};

export default Post;
