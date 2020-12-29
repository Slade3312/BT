import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function MenuBar({ children, isMobile }) {
  return (
    <div className={cx('container', { mobile: isMobile })}>
      <div className={cx('component')}>
        {children}
      </div>
    </div>
  );
}


MenuBar.propTypes = {
  children: PropTypes.node,
  isMobile: PropTypes.bool,
};
