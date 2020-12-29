import React from 'react';
import PropTypes from 'prop-types';

import { withForwardedRef } from 'enhancers';
import CustomPropTypes from 'utils/prop-types';
import { withError } from 'components/fields/TextInput/enhancers';

import { TextArrowSwitch } from '../_parts';

const optionsConstants = [
  Symbol('up'),
  Symbol('down'),
  Symbol('default'),
];

const valueConst = Symbol('default');

function SortingSwitch({
  onChange,
  isDisabled,
  forwardedRef,
  className,
  label,
  value,
  options,
  name,
}) {
  const getNextOption = (currentValue) => {
    const currentIndex = options.findIndex(item => item === currentValue);

    switch (currentIndex) {
      case 1:
        onChange(options[2]);
        return;

      case 0:
        onChange(options[1]);
        return;

      default:
        onChange(options[0]);
    }
  };

  return (
    <TextArrowSwitch
      ref={forwardedRef}
      isDisabled={isDisabled}
      label={label}
      value={value}
      options={options}
      name={name}
      onChange={getNextOption}
      className={className}
    />
  );
}

SortingSwitch.propTypes = {
  forwardedRef: CustomPropTypes.ref,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  value: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  name: PropTypes.string,
  className: PropTypes.string,
};

SortingSwitch.propConstants = {
  options: optionsConstants,
  value: valueConst,
};

export default withError(withForwardedRef(SortingSwitch));
