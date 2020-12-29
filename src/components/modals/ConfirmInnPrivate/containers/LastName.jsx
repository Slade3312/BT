import React from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import Templates from 'store/mobx/Templates';
import commonStyles from 'styles/common.pcss';
import { FFTextInput } from 'components/fields';
import styles from '../styles.pcss';
import { CONFIRM } from '../index';

const cx = classNames.bind({ ...commonStyles, ...styles });

const LastName = () => {
  return (
    <div className={cx('inputRow')}>
      <div className={styles.labelHolder}>
        <label htmlFor={CONFIRM.LAST_NAME}>{Templates.getConfirmInnPrivateTemplate('lastName')}</label>
      </div>

      <FFTextInput
        size="long"
        keepErrorIndent={false}
        name={CONFIRM.LAST_NAME}
        className={cx('inputHolder')}
       />

    </div>
  );
};

export default observer(LastName);
