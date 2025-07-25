import clsx from 'clsx';

import styles from './LikeButton.module.css';

interface Props {
  id: string;
  likeLabel: string;
  likedLabel: string;
  liked: boolean;
  onClick?: () => void;
}

export function LikeButton({ id, likeLabel, likedLabel, liked, onClick }: Props): JSX.Element {
  return (
    <button
      id={id}
      type="button"
      className={styles.button}
      aria-label={liked ? likedLabel : likeLabel}
      onClick={onClick}
    >
      <span
        className={clsx({
          [styles.liked]: liked,
          [styles.like]: !liked,
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
    </button>
  );
}
