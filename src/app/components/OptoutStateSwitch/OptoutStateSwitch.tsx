import { useCallback, useEffect, useMemo } from 'react';
import { useStore } from '@nanostores/react';

import { analyticsOptout, analyticsOptoutState, setAnalyticsOptoutState } from '../../stores/analyticsOptoutStore';
import { retrieveTranslation } from '../../locales/i18n';

import './OptoutStateSwitch.css';

type Props = {
  id: string;
};

export function OptoutStateSwitch({ id }: Props): JSX.Element {
  const $isAnalyticsOptout = useStore(analyticsOptoutState);

  useEffect(() => {
    const isAnalyticsOptoutEnabled = analyticsOptout.enabled();
    setAnalyticsOptoutState(isAnalyticsOptoutEnabled);
  }, [setAnalyticsOptoutState]);

  const onClickSwitch = useCallback(() => {
    setAnalyticsOptoutState(!$isAnalyticsOptout);

    if ($isAnalyticsOptout) {
      analyticsOptout.disable();
    } else {
      analyticsOptout.enable();
    }
  }, [$isAnalyticsOptout]);

  const buttonLabel = useMemo(
    () =>
      $isAnalyticsOptout
        ? retrieveTranslation('optout.actions.enabled')
        : retrieveTranslation('optout.actions.disabled'),
    [$isAnalyticsOptout],
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={$isAnalyticsOptout}
      className={`OptoutStateSwitch ${$isAnalyticsOptout ? 'OptoutStateSwitchOn' : 'OptoutStateSwitchOff'}`}
      id={id}
      onClick={onClickSwitch}
    >
      <span className="visually-hidden">{buttonLabel}</span>
    </button>
  );
}
