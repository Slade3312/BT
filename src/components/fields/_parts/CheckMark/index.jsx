import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withForwardedRef } from 'enhancers';
import CustomPropTypes from 'utils/prop-types';
import { GlobalIcon } from 'components/common';

import styles from './styles.pcss';

const cx = classNames.bind(styles);

function CheckMark({ id, name, className, forwardedRef, onChange, onBlur, value, disabled }) {
  const handleChange = (e) => {
    onChange(!value, e);
  };
  const handleClick = (e) => {
    if (onBlur) {
      onBlur(!value, e);
    }
  };
  const handleKeyUp = (e) => {
    if (e.key === 'Enter') onChange(!value, e);
  };

  return (
    <div className={cx('container', { selected: value }, className)}>
      <span ref={forwardedRef} className={cx('check')} >
        {value && <GlobalIcon slug="checkMark" />}
      </span>

      <input
        type="checkbox"
        className={cx('input')}
        id={id}
        name={name}
        onKeyUp={handleKeyUp}
        onClick={handleClick}
        onChange={handleChange}
        disabled={disabled}
      />
      <div className={cx('focusController')} />
    </div>
  );
}

CheckMark.propTypes = {
  className: PropTypes.string,
  forwardedRef: CustomPropTypes.ref,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  name: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.any,
};

export default withForwardedRef(CheckMark);
