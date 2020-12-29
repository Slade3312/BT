import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withForwardedRef } from 'enhancers';

import CustomPropTypes from 'utils/prop-types';

import SortingSwitch from '../SortingSwitch';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

function SortingSwitchGroup({ onChange, forwardedRef, value, options }) {
  const onChangeOption = newValue => onChange(newValue);

  return (
    <div className={cx('component')} ref={forwardedRef}>
      {options.map(item => (
        <SortingSwitch
          key={item.name}
          label={item.label}
          name={item.name}
          value={value || item.options[2]}
          options={item.options}
          isDisabled={item.isDisabled}
          onChange={onChangeOption}
        />
      ))}
    </div>
  );
}

SortingSwitchGroup.propTypes = {
  forwardedRef: CustomPropTypes.ref,
  onChange: PropTypes.func,
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.shape(SortingSwitch.PropTypes)),
};

export default withForwardedRef(SortingSwitchGroup);
