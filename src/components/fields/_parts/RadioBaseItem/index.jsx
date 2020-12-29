import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Tooltip from 'components/common/Tooltip';
import RadioButton from '../RadioButton';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

export default function RadioBaseItem({ label, value, onChange, isSelected, className, tooltip }) {
  return (
    <div className={cx('component', className)}>
      <RadioButton
        className="button"
        value={value}
        isSelected={isSelected}
        onChange={onChange}
      />

      <span className={cx('label')}>{label}</span>

      {tooltip && <Tooltip className={cx('tooltip')}>{tooltip}</Tooltip>}
    </div>
  );
}

RadioBaseItem.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  onChange: PropTypes.func,
  isSelected: PropTypes.bool,
  className: PropTypes.string,
  tooltip: PropTypes.string,
};
