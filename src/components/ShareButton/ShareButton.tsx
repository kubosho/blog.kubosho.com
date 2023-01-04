import { useCallback, useEffect, useState } from 'react';

import { retrieveTranslation } from '../../locales/i18n';
import { ShareIcon } from '../Icon/ShareIcon';

import styles from './ShareButton.module.css';

type Props = {
  text: string;
  title: string;
  url: string;
};

const TIME_TO_DISPLAY_MESSAGE = 5000;

export const ShareButton = ({ text, title, url }: Props): JSX.Element => {
  const [isDisplayingMessage, setIsDisplayingMessage] = useState(false);
  const handleClick = useCallback(() => {
    (async () => {
      try {
        await navigator.share({ text, title, url });
      } catch (error) {
        if (error.name === 'TypeError') {
          setIsDisplayingMessage(true);
          await navigator.clipboard.writeText(url);
        }
      }
    })();
  }, [text, title, url]);

  useEffect(() => {
    if (!isDisplayingMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setIsDisplayingMessage(false);
    }, TIME_TO_DISPLAY_MESSAGE);

    return () => {
      clearTimeout(timer);
    };
  }, [isDisplayingMessage]);

  return (
    <div className={styles['share-button-container']}>
      <button
        type="button"
        id="shareButton"
        name="shareButton"
        className={styles['share-button']}
        onClick={handleClick}
      >
        <ShareIcon />
      </button>
      {isDisplayingMessage && (
        <output className={styles['message']} name="copiedURL" htmlFor="shareButton">
          {retrieveTranslation('components.shareButton.message')}
        </output>
      )}
    </div>
  );
};
