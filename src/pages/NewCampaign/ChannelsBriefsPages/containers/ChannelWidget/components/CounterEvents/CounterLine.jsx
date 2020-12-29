import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { formatPrice } from 'utils/formatting';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const CounterLine = ({ prefixText, value, isBig, isSecond, isDisabled }) => (
  <div className={cx('counterLine')}>
    <span className={cx('rangeText', { second: isSecond, disabled: isDisabled })}>{prefixText}</span>
    <span className={cx('price', { big: isBig, disabled: isDisabled })}>{formatPrice(value)}</span>
  </div>
);

CounterLine.propTypes = {
  prefixText: PropTypes.string,
  value: PropTypes.number,
  isBig: PropTypes.bool,
  isSecond: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default CounterLine;
