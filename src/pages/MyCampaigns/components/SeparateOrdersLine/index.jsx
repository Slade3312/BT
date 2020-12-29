import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function SeparateOrdersLine({ className }) {
  return <div className={cx('component', className)} />;
}

SeparateOrdersLine.propTypes = {
  className: PropTypes.string,
};
