import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { OptionsItem, CheckMark } from '../../../../../_parts';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function MultiOptionsItem({ className, children, onSelect, ...otherProps }) {
  const { isSelected, id } = otherProps;
  return (
    <OptionsItem {...otherProps} onSelect={onSelect} className={cx('multiOption', className)} isDropdown>
      <CheckMark id={id} value={isSelected} className={cx('check')} onChange={onSelect} />
      <div className={cx('content')}>{children}</div>
    </OptionsItem>
  );
}

MultiOptionsItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,

  /** otherProps */
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
};
