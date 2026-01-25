'use client';

import clsx from 'clsx';
import { useCallback, useState } from 'react';

import { useLikes } from '../../hooks/useLikes';
import { LikeCountsSkeleton } from '../LikeCountsSkeleton';
import styles from './LikeButton.module.css';

type Props = {
  entryId: string;
  likeLabel: string;
  onClick?: () => void;
};

export function LikeButton({ entryId, likeLabel, onClick }: Props): React.JSX.Element {
  const [clapping, setClapping] = useState(false);

  const { counts, handleLikes, isLoading } = useLikes({ entryId });

  const handleClick = useCallback(() => {
    handleLikes();

    setClapping(false);
    requestAnimationFrame(() => {
      setClapping(true);
    });

    onClick?.();
  }, [handleLikes, onClick]);

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
