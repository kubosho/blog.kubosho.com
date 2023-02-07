import { Switch } from '@headlessui/react';

import { retrieveTranslation } from '../../locales/i18n';

import styles from './OptOutStateSwitch.module.css';

type Props = {
  isOptOut: boolean;
  setOptOut: () => void;
};

export function OptOutStateSwitch({ isOptOut, setOptOut }: Props): JSX.Element {
  return (
    <div className={styles['opt-out-state-switch-container']}>
      <label htmlFor="optout">{retrieveTranslation('optout.label')}</label>
      <Switch
        id="optout"
        checked={isOptOut}
        onChange={setOptOut}
        className={`${isOptOut ? styles['opt-out-state-switch--on'] : styles['opt-out-state-switch--off']} ${
          styles['opt-out-state-switch']
        }`}
      >
        <span
          className={`${
            isOptOut ? styles['opt-out-state-switch__rounded--on'] : styles['opt-out-state-switch__rounded--off']
          } ${styles['opt-out-state-switch__rounded']}`}
        />
        <span className="visually-hidden">
          {isOptOut ? retrieveTranslation('optout.actions.disabled') : retrieveTranslation('optout.actions.enabled')}
        </span>
      </Switch>
    </div>
  );
}
