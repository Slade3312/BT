import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function OverlayLock({ children, isLoading, className }) {
  return <div className={cx('component', { active: isLoading }, className)}>{children}</div>;
}

OverlayLock.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};
