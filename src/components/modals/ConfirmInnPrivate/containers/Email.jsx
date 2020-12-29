import React from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import commonStyles from 'styles/common.pcss';
import Templates from 'store/mobx/Templates';
import { FFTextInput } from 'components/fields';
import styles from '../styles.pcss';
import { CONFIRM } from '../index';

const cx = classNames.bind({ ...commonStyles, ...styles });

const Email = () => {
  return (
    <div className={cx('inputRow')}>
      <div className={styles.labelHolder}>
        <label htmlFor={CONFIRM.EMAIL}>{Templates.getConfirmInnPrivateTemplate('email')}</label>
      </div>

      <FFTextInput
        size="long"
        keepErrorIndent={false}
        name={CONFIRM.EMAIL}
        className={cx('inputHolder')}
      />
    </div>
  );
};

export default observer(Email);
