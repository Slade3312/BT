import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const PlateContainer = ({ children, column, isMobile }) => (
  <div className={cx('component', { column, mobile: isMobile })}>{children}</div>
);

PlateContainer.propTypes = {
  children: PropTypes.node,
  isMobile: PropTypes.bool,
  column: PropTypes.bool,
};

export default PlateContainer;
