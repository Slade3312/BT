import React from 'react';
import PropsTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const ViewerButton = ({ isActive, isOpeningForbidden }) => (
  <div className={cx(
    'button',
    { active: (isActive) && !isOpeningForbidden, clickable: !isOpeningForbidden },
  )}>
    <div className={cx('arrow')} />
  </div>
);

ViewerButton.propTypes = {
  isActive: PropsTypes.bool,
  isOpeningForbidden: PropsTypes.bool,
};

export default ViewerButton;
