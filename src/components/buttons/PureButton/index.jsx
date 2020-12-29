import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function PureButton({ className, type, ...otherProps }) {
  return <button type={type} className={cx('component', className)} {...otherProps} />;
}

PureButton.defaultProps = {
  type: 'button',
};

PureButton.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
};
