import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { Preloader } from 'components/common';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const Loader = ({ children, isLoading, className, size }) => (
  <React.Fragment>
    <div className={cx('component', { active: isLoading }, className)}>
      {children}
    </div>

    {isLoading && <Preloader size={size} className={cx('preloader')} />}
  </React.Fragment>
);

Loader.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  size: PropTypes.number,
};

export default Loader;
