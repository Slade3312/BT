import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const CounterRangeRow = ({ children }) => <div className={cx('rangeRow')}>{children}</div>;

CounterRangeRow.propTypes = {
  children: PropTypes.node,
};

export default CounterRangeRow;
