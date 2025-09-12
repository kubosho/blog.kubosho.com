import clsx from 'clsx';
import { useCallback, useState } from 'react';

import { useLikes } from '../../hooks/useLikes';
import styles from './LikeButton.module.css';

interface Props {
  counts: number;
  entryId: string;
  likeLabel: string;
  onClick?: () => void;
}

export function LikeButton({ counts, entryId, likeLabel, onClick }: Props): React.JSX.Element {
  const hookData = useLikes({ entryId, initialCounts: counts });

  const [pulsing, setPulsing] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const likeCounts = hookData?.counts;

  const handleClick = useCallback(() => {
    hookData.handleLikes();

    setPulsing(false);

    // Restart animation reliably on rapid clicks
    requestAnimationFrame(() => {
      setPulseKey((k) => k + 1);
      setPulsing(true);
    });

    onClick?.();
  }, [hookData?.handleLikes, onClick]);

  const handleAnimationEnd = useCallback(() => {
    setPulsing(false);
  }, []);

  return (
    <div className={styles.container}>
      <button type="button" className={clsx(styles.button)} aria-label={likeLabel} onClick={handleClick}>
        <span key={pulseKey} className={clsx(styles.like, pulsing && styles.pulse)} onAnimationEnd={handleAnimationEnd}>
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
      </button>
      {likeCounts != null && (
        <span className={styles.count} aria-live="polite">
          {likeCounts}
        </span>
      )}
    </div>
  );
}
