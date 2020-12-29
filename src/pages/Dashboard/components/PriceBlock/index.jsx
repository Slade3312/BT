import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { formatPriceWithLabel } from 'utils/formatting';
import CustomPropTypes from 'utils/prop-types';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function PriceBlock({ value, pricePrefix, className }) {
  return (
    <div className={cx('price', className)}>
      {pricePrefix && <span>{pricePrefix}</span>} {formatPriceWithLabel(value)}
    </div>
  );
}

PriceBlock.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pricePrefix: CustomPropTypes.templateField,
  className: PropTypes.string,
};
