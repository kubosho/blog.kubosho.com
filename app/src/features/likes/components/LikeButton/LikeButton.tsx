'use client';

import clsx from 'clsx';
import { useCallback, useState } from 'react';

import { pushEvent } from '../../../../data/tracking/dataLayer';
import { useLikes } from '../../hooks/useLikes';
import { LikeCountsSkeleton } from '../LikeCountsSkeleton';
import styles from './LikeButton.module.css';

type Props = {
  entryId: string;
  entryTitle: string;
  likeLabel: string;
  onClick?: () => void;
};

export function LikeButton({ entryId, entryTitle, likeLabel, onClick }: Props): React.JSX.Element {
  const [clapping, setClapping] = useState(false);

  const { counts, handleLikes, isLoading } = useLikes({ entryId });

  const handleClick = useCallback(() => {
    handleLikes();
    pushEvent({ event: 'like_click', entry_id: entryId, entry_title: entryTitle });

    setClapping(false);
    requestAnimationFrame(() => {
      setClapping(true);
    });

    onClick?.();
  }, [handleLikes, entryId, entryTitle, onClick]);

  const handleAnimationEnd = useCallback(() => {
    setClapping(false);
  }, []);

  return (
    <div className={styles.container}>
      <button type="button" className={clsx(styles.button)} aria-label={likeLabel} onClick={handleClick}>
        <span className={clsx(styles.clap, clapping && styles.clapping)} onAnimationEnd={handleAnimationEnd}>
          👏
        </span>
      </button>
      {isLoading ? (
        <span className={styles.count}>
          <LikeCountsSkeleton />
        </span>
      ) : (
        <span className={styles.count} aria-live="polite">
          {counts}
        </span>
      )}
    </div>
  );
}
