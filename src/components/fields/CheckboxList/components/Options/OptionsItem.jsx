import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import { OptionsItem as RawOptionsItem, CheckMark } from '../../../_parts';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


export default function OptionsItem({ className, onSelect, children, isSelected, id, ...otherProps }) {
  return (
    <label htmlFor={id}>
      <RawOptionsItem {...otherProps} className={cx('option', className)}>
        <CheckMark id={id} value={isSelected} className={cx('check')} onChange={onSelect} />
        <div className={cx('content')}>{children}</div>
      </RawOptionsItem>
    </label>

  );
}

OptionsItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string,
  /** otherProps */
  isSelected: PropTypes.bool,
  onSelect: PropTypes.func,
};
