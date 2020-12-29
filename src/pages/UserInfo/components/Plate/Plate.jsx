import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const Plate = ({ children, className }) => (
  <div className={cx('container', className)}>
    {children}
  </div>
);

Plate.propTypes = {
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
};

export default Plate;
