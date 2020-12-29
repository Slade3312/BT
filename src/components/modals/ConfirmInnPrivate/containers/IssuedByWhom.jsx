import React from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import commonStyles from 'styles/common.pcss';
import Templates from 'store/mobx/Templates';
import { FFTextInput } from 'components/fields';
import styles from '../styles.pcss';
import { CONFIRM } from '../index';

const cx = classNames.bind({ ...commonStyles, ...styles });

const IssuedByWhom = () => {
  return (
    <div className={cx('inputRow')}>
      <div className={styles.labelHolder}>
        <label htmlFor={CONFIRM.ISSUEDBY}>{Templates.getConfirmInnPrivateTemplate('issuedBy')}</label>
      </div>

      <FFTextInput
        keepErrorIndent={false}
        name={CONFIRM.ISSUEDBY}
        size="long"
        maxLength="300"
        className={cx('inputHolder')}
      />
    </div>
  );
};

export default observer(IssuedByWhom);
