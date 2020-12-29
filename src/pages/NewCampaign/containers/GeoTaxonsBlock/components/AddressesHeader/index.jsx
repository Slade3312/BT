import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { PureButton } from 'components/buttons';
import { wordFormByCount } from 'utils/fn';
import { LightText } from 'components/common';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function AddressesHeader({ addressesCount, onClick }) {
  const addressesCases = ['адрес', 'адресa', 'адресов'];

  return (
    <div className={cx('container')}>
      <span className={cx('countLabel', 'headerFont')}>
        Выбрано {addressesCount} {wordFormByCount(addressesCount, addressesCases)}
      </span>

      <LightText className={cx('headerFont', 'radiusLabel')}>Радиус (км)</LightText>

      <PureButton
        className={cx('button', 'headerFont')}
        onClick={onClick}
      >
        Удалить все
      </PureButton>
    </div>
  );
}

AddressesHeader.propTypes = {
  onClick: PropTypes.func,
  addressesCount: PropTypes.number,
};

export default AddressesHeader;
