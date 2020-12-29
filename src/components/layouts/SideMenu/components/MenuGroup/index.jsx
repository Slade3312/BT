import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function MenuGroup({ isActive, isLast, isCompact, className, children }) {
  return (
    <div className={cx('component', { active: isActive, compact: isCompact, last: isLast }, className)}>
      <div className={cx('splitLine')} />
      {children}
    </div>
  );
}

MenuGroup.propTypes = {
  isActive: PropTypes.bool,
  isCompact: PropTypes.bool,
  isLast: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node,
};
