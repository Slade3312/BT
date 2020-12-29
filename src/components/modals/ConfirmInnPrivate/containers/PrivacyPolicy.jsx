import React from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import Templates from 'store/mobx/Templates';
import commonStyles from 'styles/common.pcss';
import { FFCheckbox } from 'components/fields';
import styles from '../styles.pcss';
import { CONFIRM } from '../index';

const cx = classNames.bind({ ...commonStyles, ...styles });

const PrivacyPolicy = () => {
  return (
    <div className={cx('inputsHolder')}>
      <div className={cx('privacyPolicyRow')}>
        <FFCheckbox
          name={CONFIRM.PRIVACY_POLICY}
        />

        <a
          className={styles.privacyPolicy}
          rel="noreferrer"
          target="_blank"
          href={Templates.getConfirmInnPrivateTemplate('privacyLink')}
        >
          {Templates.getConfirmInnPrivateTemplate('privacyTitle')}
        </a>
      </div>
    </div>
  );
};

export default observer(PrivacyPolicy);
