import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function ChartRow({ children }) {
  return <div className={cx('component')}>{children}</div>;
}

ChartRow.propTypes = {
  children: PropTypes.node,
};
