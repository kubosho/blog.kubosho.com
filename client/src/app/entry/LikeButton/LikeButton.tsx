import clsx from 'clsx';
import { useCallback, type ReactElement } from 'react';

import { useLikes } from '../../../hooks/useLikes';
import styles from './LikeButton.module.css';

interface Props {
  entryId: string;
  id?: string;
  likeLabel?: string;
  likedLabel?: string;
  initialCount?: number;
  showCount?: boolean;
  onClick?: () => void;
}

export function LikeButton({
  entryId,
  id = `like-button-${entryId}`,
  likeLabel = 'いいね',
  likedLabel = 'いいね済み',
  initialCount = 0,
  showCount = true,
  onClick,
}: Props): ReactElement {
  const { likeCount, handleLike, isRateLimited, pendingCount } = useLikes(entryId, initialCount);

  const hasLikes = likeCount > 0;
  const displayCount = likeCount + (pendingCount > 0 ? ` (+${pendingCount})` : '');

  const handleClick = useCallback(() => {
    onClick?.();
    handleLike();
  }, [onClick, handleLike]);

  return (
    <button
      id={id}
      type="button"
      className={clsx(styles.button, {
        [styles.rateLimited]: isRateLimited,
      })}
      aria-label={hasLikes ? likedLabel : likeLabel}
      onClick={handleClick}
      disabled={isRateLimited}
      title={isRateLimited ? 'しばらくお待ちください' : undefined}
    >
      <span
        className={clsx({
          [styles.liked]: hasLikes,
          [styles.like]: !hasLikes,
        })}
      >
        <svg
          aria-hidden="true"
          height="24"
          width="24"
          role="img"
          viewBox="-8 0 250 210"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M213.588,120.982L115,213.445l-98.588-92.463C-6.537,96.466-5.26,57.99,19.248,35.047l2.227-2.083 c24.51-22.942,62.984-21.674,85.934,2.842L115,43.709l7.592-7.903c22.949-24.516,61.424-25.784,85.936-2.842l2.227,2.083 C235.26,57.99,236.537,96.466,213.588,120.982z"></path>
        </svg>
      </span>
      {showCount && likeCount > 0 && (
        <span className={styles.count} aria-live="polite">
          {displayCount}
        </span>
      )}
    </button>
  );
}
