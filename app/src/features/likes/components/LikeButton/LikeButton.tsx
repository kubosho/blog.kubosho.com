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
  const [pulsing, setPulsing] = useState(false);

  const { counts, handleLikes, isLoading } = useLikes({ entryId });

  const handleClick = useCallback(() => {
    handleLikes();

    setPulsing(false);
    requestAnimationFrame(() => {
      setPulsing(true);
    });

    onClick?.();
  }, [handleLikes, onClick]);

  const handleAnimationEnd = useCallback(() => {
    setPulsing(false);
  }, []);

  return (
    <div className={styles.container}>
      <button type="button" className={clsx(styles.button)} aria-label={likeLabel} onClick={handleClick}>
        <span className={clsx(styles.like, pulsing && styles.pulse)} onAnimationEnd={handleAnimationEnd}>
          <svg
            aria-hidden="true"
            height="24"
            width="24"
            viewBox="-8 0 250 210"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
          >
            <path d="M213.588 120.982 115 213.445l-98.588-92.463C-6.537 96.466-5.26 57.99 19.248 35.047l2.227-2.083c24.51-22.942 62.984-21.674 85.934 2.842L115 43.709l7.592-7.903c22.949-24.516 61.424-25.784 85.936-2.842l2.227 2.083c24.505 22.943 25.782 61.419 2.833 85.935z" />
          </svg>
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
