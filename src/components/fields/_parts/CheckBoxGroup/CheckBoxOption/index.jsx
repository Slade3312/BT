import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { withForwardedRef } from 'enhancers';
import CustomPropTypes from 'utils/prop-types';
import { Tooltip } from 'components/common';
import CheckMark from '../../CheckMark';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function CheckBoxOption({ value, disabled, labelClassName, label, id, name, onChange, tooltip, forwardedRef, className, isInactiveTransparent }) {
  return (
    <div className={cx('component', { inactive: isInactiveTransparent && !value }, className)}>
      <label className={cx('wrapper')}>
        <CheckMark
          onChange={onChange}
          ref={forwardedRef}
          disabled={disabled}
          className={cx('checkbox')}
          name={name}
          id={id}
          value={value}
        />

        <span className={labelClassName || cx('label')}>{label}</span>
      </label>

      {tooltip && <Tooltip className={cx('tooltip')}>{tooltip}</Tooltip>}
    </div>
  );
}

CheckBoxOption.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isInactiveTransparent: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  id: PropTypes.string,
  name: PropTypes.string,
  tooltip: CustomPropTypes.templateField,
  className: PropTypes.string,
  forwardedRef: CustomPropTypes.ref,
  labelClassName: PropTypes.any,
  disabled: PropTypes.any,
};

export default withForwardedRef(CheckBoxOption);
