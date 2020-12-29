import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { formatPrice } from 'utils/formatting';
import { FormFieldLabel } from 'components/forms';
import styles from './styles.pcss';

const BudgetFormContent = ({ budget, isShowPrefix, isDisabled }) => (
  <div className={classNames(styles.container, isDisabled && styles.disabled)}>
    {isShowPrefix && <span className={styles.textFrom}>от</span>}
    <div className={styles.wrapper}>
      <FormFieldLabel classNameContent={styles.priceText} className={styles.priceLabel}>{formatPrice(budget)}</FormFieldLabel>
    </div>
  </div>
);

BudgetFormContent.propTypes = {
  budget: PropTypes.number,
  isShowPrefix: PropTypes.bool,
  isDisabled: PropTypes.bool,
};

export default BudgetFormContent;
