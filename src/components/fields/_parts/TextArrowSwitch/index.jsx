import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { withForwardedRef } from 'enhancers';
import CustomPropTypes from 'utils/prop-types';
import ToBottomArrowIcon from './assets/ToBottomArrow.svg';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function TextArrowSwitch({ value, options, label, name, onChange, forwardedRef, isDisabled, className }) {
  const handleChange = () => onChange(value);
  return (
    <label className={cx('component', { disabled: isDisabled }, className)}>
      {label}
      <input
        className={cx('input')}
        ref={forwardedRef}
        onClick={handleChange}
        type="button"
        name={name}
        disabled={isDisabled}
      />
      <div className={cx('arrowsContainer')}>
        <ToBottomArrowIcon className={cx('arrowUp', { active: value === options[0] })} />

        <ToBottomArrowIcon className={cx('arrowDown', { active: value === options[1] })} />
      </div>
    </label>
  );
}

TextArrowSwitch.propTypes = {
  label: PropTypes.string,
  onChange: PropTypes.func,
  name: PropTypes.string,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
  forwardedRef: CustomPropTypes.ref,
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
};

export default withForwardedRef(TextArrowSwitch);
