import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { OptionsItem } from '../../../../../_parts';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function MultiOptionsItem({ className, ...otherProps }) {
  const { isSelected } = otherProps;
  return (
    <OptionsItem
      {...otherProps}
      className={cx('multiOption', { selected: isSelected }, className)}
      isDropdown
    />
  );
}

MultiOptionsItem.propTypes = {
  options: PropTypes.any,
  value: PropTypes.any,
  onChange: PropTypes.any,
  className: PropTypes.string,
};
