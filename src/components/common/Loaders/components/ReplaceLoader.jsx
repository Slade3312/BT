import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Preloader from 'components/common/Preloader';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const ReplaceLoader = ({ children, isLoading, className }) => (
  <div className={cx('component', { active: isLoading }, className)}>
    {isLoading ? <Preloader className={cx('preloader')} /> : children}
  </div>
);

ReplaceLoader.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
};

export default ReplaceLoader;
