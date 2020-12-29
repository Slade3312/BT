import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function TopBar({ children, isMobile, className }) {
  return (
    <div className={cx('container', { mobile: isMobile }, className)}>
      <div className={cx('component')}>
        {children}
      </div>
    </div>
  );
}

TopBar.propTypes = {
  children: PropTypes.node,
  isMobile: PropTypes.bool,
  className: PropTypes.string,
};
