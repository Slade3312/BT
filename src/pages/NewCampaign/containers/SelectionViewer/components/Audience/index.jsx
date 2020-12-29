import React from 'react';
import PropsTypes from 'prop-types';
import classNames from 'classnames/bind';
import SelectionCounter from '../../../SelectionCounter';
import ViewerButton from '../ViewerButton';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const Audience = ({ isActive, isOpeningForbidden }) => (
  <div className={cx('container')}>
    <div className={cx('col')}>
      <ViewerButton isActive={isActive} isOpeningForbidden={isOpeningForbidden} />
    </div>
    <div className={cx('col', 'selection')}>
      <SelectionCounter />
    </div>
  </div>
);

Audience.propTypes = {
  isActive: PropsTypes.bool,
  isOpeningForbidden: PropsTypes.bool,
};

export default Audience;
