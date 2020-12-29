import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import CustomPropTypes from 'utils/prop-types';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function RadioButtonChip({ isSelected, forwardedRef, onChange, value, label }) {
  const handleChange = () => onChange(value);

  return (
    <label className={cx('container', { selected: isSelected })}>
      <input
        ref={forwardedRef}
        type="radio"
        className={cx('input')}
        checked={isSelected}
        onChange={handleChange}
      />
      <span className={styles.label}>
        {label}
      </span>
    </label>
  );
}

RadioButtonChip.propTypes = {
  isSelected: PropTypes.bool,
  forwardedRef: CustomPropTypes.ref,
  onChange: PropTypes.func,
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
};

export default RadioButtonChip;
