import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function TileWrapper({ className, children, isCompact, isBright }) {
  return <div className={cx('component', { compact: isCompact, bright: isBright }, className)}>{children}</div>;
}

TileWrapper.propTypes = {
  children: PropTypes.node,
  isCompact: PropTypes.bool,
  isBright: PropTypes.bool,
  className: PropTypes.string,
};
