import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const ErrorItemComponent = ({ value }) => (
  <div className={cx('item')}>
    <span>{value}</span>
  </div>
);

ErrorItemComponent.propTypes = {
  value: PropTypes.string,
};

export default ErrorItemComponent;
