import React from 'react';
import classNames from 'classnames/bind';
import PropTypes from 'prop-types';
import { withForwardedRef } from 'enhancers';
import CustomPropTypes from 'utils/prop-types';
import { withError } from 'components/fields/TextInput/enhancers';
import { isNullOrUndefined } from 'utils/fn';

import RadioBaseItem from '../_parts/RadioBaseItem';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function RadioGroup({ value, defaultValue, options, isVertical, onChange, forwardedRef, ItemComponent, itemClassName, className }) {
  return (
    <div className={cx('component', { isVertical }, className)} ref={forwardedRef}>
      {options.map(({ value: val, tooltip, ...other }, index) => {
        return (
          <div className={cx('wrapper', itemClassName)} key={val}>
            <label className={cx('label')}>
              <ItemComponent
                value={val}
                isSelected={!isNullOrUndefined(value) ? value === val : val === defaultValue}
                onChange={onChange}
                tooltip={tooltip}
                isLast={index === options.length - 1}
                {...other}
              />
            </label>
          </div>
        );
      })}
    </div>
  );
}

RadioGroup.defaultProps = {
  ItemComponent: RadioBaseItem,
  options: [],
};

RadioGroup.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.bool]),
  defaultValue: PropTypes.any,
  options: CustomPropTypes.options,
  onChange: PropTypes.func,
  forwardedRef: CustomPropTypes.ref,
  ItemComponent: CustomPropTypes.component,
  isVertical: PropTypes.bool,
  itemClassName: PropTypes.string,
  className: PropTypes.string,
};

export default withError(withForwardedRef(RadioGroup));
