import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import Tooltip from 'components/common/Tooltip';
import RadioBaseItem from '../RadioBaseItem';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

const RadioBoxButton = ({ value, onChange, isSelected, label, className, tooltip }) => (
  <div className={cx('component', { selected: isSelected }, className)}>
    <RadioBaseItem
      className={cx('wrapper')}
      value={value}
      isSelected={isSelected}
      onChange={onChange}
      label={label}
    />

    {tooltip && <Tooltip className={cx('tooltip')}>{tooltip}</Tooltip>}
  </div>
);

RadioBoxButton.propTypes = {
  className: PropTypes.string,
  isSelected: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  label: PropTypes.string,
  tooltip: PropTypes.string,
};

export default RadioBoxButton;
