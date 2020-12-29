import React from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import Templates from 'store/mobx/Templates';
import commonStyles from 'styles/common.pcss';
import { FFTextInput } from 'components/fields';
import styles from '../styles.pcss';
import { CONFIRM } from '../index';

const cx = classNames.bind({ ...commonStyles, ...styles });

const MiddleName = () => {
  return (
    <div className={cx('inputRow')}>
      <div className={styles.labelHolder}>
        <label htmlFor={CONFIRM.MIDDLE_NAME}>{Templates.getConfirmInnPrivateTemplate('middleName')}</label>
      </div>

      <FFTextInput
        size="long"
        keepErrorIndent={false}
        name={CONFIRM.MIDDLE_NAME}
        className={cx('inputHolder')}
      />
    </div>
  );
};

export default observer(MiddleName);
