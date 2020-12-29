import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function OptionsItem({
  isSelected,
  onSelect,
  children,
  className,
  isDropdown,
  isCompact,
}) {
  return (
    <div
      className={cx('item', { selected: isSelected, dropdown: isDropdown, compact: isCompact }, className)}
      onClick={onSelect}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  );
}

OptionsItem.propTypes = {
  children: PropTypes.node,
  isSelected: PropTypes.bool,
  isDropdown: PropTypes.bool,
  onSelect: PropTypes.func,
  className: PropTypes.string,
  isCompact: PropTypes.bool,
};
