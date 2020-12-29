import React from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import Templates from 'store/mobx/Templates';
import commonStyles from 'styles/common.pcss';
import { FFPriceInput } from 'components/fields';
import styles from '../styles.pcss';
import { CONFIRM } from '../index';

const cx = classNames.bind({ ...commonStyles, ...styles });

const SerialNumber = () => {
  return (
    <div className={cx('inputRow')}>
      <div className={styles.labelHolder}>
        <label htmlFor={CONFIRM.SERIALDOC}>{Templates.getConfirmInnPrivateTemplate('serialNumber')}</label>
      </div>

      <FFPriceInput
        keepErrorIndent={false}
        name={CONFIRM.SERIALDOC}
        notApplyMask
        maxLength={15}
        className={cx('inputHolder', 'serial')}
      />

      <FFPriceInput
        keepErrorIndent={false}
        name={CONFIRM.NUMBERDOC}
        notApplyMask
        maxLength={80}
        className={cx('inputHolder')}
      />
    </div>
  );
};

export default observer(SerialNumber);
