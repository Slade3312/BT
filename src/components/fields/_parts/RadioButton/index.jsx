import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withForwardedRef } from 'enhancers';
import CustomPropTypes from 'utils/prop-types';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function RadioButton({ isSelected, forwardedRef, onChange, value, className }) {
  const handleChange = () => onChange(value);

  return (
    <div className={cx('component', { selected: isSelected }, className)}>
      <div className={cx('mark')} />

      <input
        ref={forwardedRef}
        type="radio"
        className={cx('input')}
        checked={isSelected}
        onChange={handleChange}
      />

      <div className={cx('focusController')} />
    </div>
  );
}

RadioButton.propTypes = {
  isSelected: PropTypes.bool,
  forwardedRef: CustomPropTypes.ref,
  onChange: PropTypes.func,
  className: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
};

export default withForwardedRef(RadioButton);
