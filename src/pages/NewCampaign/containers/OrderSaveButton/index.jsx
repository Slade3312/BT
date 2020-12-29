import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { ActionButton } from 'components/buttons';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function OrderSaveButton({ children, onClick, className, isLight }) {
  return (
    <ActionButton
      onClick={onClick}
      className={cx('button', className)}
      isLight={isLight}
      iconSlug="arrowRightMinimal"
    >
      {children}
    </ActionButton>
  );
}

OrderSaveButton.propTypes = {
  children: PropTypes.node,
  isLight: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default OrderSaveButton;
