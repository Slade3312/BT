import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';

import { withForwardedRef } from 'enhancers';
import BaseSwitch from '../_parts/BaseSwitch';
import { withError } from '../TextInput/enhancers';

import styles from './styles.pcss';

const cx = classNames.bind(styles);


function Switch({ value, onChange, isDisabled, forwardedRef, ...otherProps }) {
  return (
    <BaseSwitch
      {...otherProps}
      ref={forwardedRef}
      disabled={isDisabled}
      checked={value || false}
      onChange={event => onChange(!value, event)}
      className={cx('container')}
    />
  );
}

Switch.propTypes = {
  ...BaseSwitch.propTypes,
  value: PropTypes.any,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  className: PropTypes.string,
};


export default withError(withForwardedRef(Switch));
