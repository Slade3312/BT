import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Preloader from 'components/common/Preloader';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const OverlayLoader = ({ children, isLoading, className, isTopPosition }) => (
  <div className={cx('component', { active: isLoading }, className)}>
    {isLoading && <Preloader className={cx('preloader', { top: isTopPosition })} />}
    {children}
  </div>
);

OverlayLoader.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  isTopPosition: PropTypes.bool,
  className: PropTypes.string,
};

export default OverlayLoader;
