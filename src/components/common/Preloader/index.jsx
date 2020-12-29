import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Img from './image.svg';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function Preloader({ size, className, ...otherProps }) {
  return (
    <div className={cx('component', className)}>
      <Img width={size} height={size} {...otherProps} className={cx('image')} />
    </div>
  );
}
Preloader.propTypes = {
  className: PropTypes.string,
  size: PropTypes.string,
};

Preloader.defaultProps = {
  size: '48',
};
