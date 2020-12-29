import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { formatPriceWithLabel } from 'utils/formatting';
import StrikeThroughText from '../StrikeThroughText';
import styles from './styles.pcss';

export default function TotalCost({
  prefix,
  price,
  discountPrice,
  className,
  postfix,
  isSecondaryPostfix,
}) {
  const showDiscount = typeof discountPrice === 'number';
  return (
    <div className={classNames(styles.component, className)}>
      <span>{prefix}</span>

      {showDiscount && (
        <StrikeThroughText className={styles.previousPrice}>
          {formatPriceWithLabel(price)}
        </StrikeThroughText>
      )}

      <span className={styles.price}>
        {formatPriceWithLabel(showDiscount ? discountPrice : price)}
      </span>

      <span className={classNames(styles.postfix, isSecondaryPostfix && styles.secondary)}>{postfix}</span>
    </div>
  );
}

TotalCost.propTypes = {
  prefix: PropTypes.string,
  isSecondaryPostfix: PropTypes.bool,
  className: PropTypes.string,
  price: PropTypes.number,
  discountPrice: PropTypes.number,
  postfix: PropTypes.string,
};
