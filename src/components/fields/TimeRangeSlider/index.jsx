import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from 'utils/prop-types';
import { withForwardedRef } from 'enhancers';
import RangeSlider from 'components/fields/RangeSlider';

export const defaultTimeRange = [9, 21];

const TimeRangeSlider = ({ value, onChange, min, max, isValueLabelled, defaultValue, forwardedRef, ...otherProps }) => {
  const [valueFrom, valueTo] = value || defaultValue;

  return (
    <RangeSlider
      {...otherProps}
      ref={forwardedRef}
      valueFrom={valueFrom}
      minInterval={1}
      valueTo={valueTo}
      min={min}
      max={max}
      isValueLabelled={isValueLabelled}
      onMinValueChange={val => onChange([val, valueTo])}
      onMaxValueChange={val => onChange([valueFrom, val])}
    />
  );
};

TimeRangeSlider.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
  max: PropTypes.number,
  min: PropTypes.number,
  forwardedRef: CustomPropTypes.ref,
  isValueLabelled: PropTypes.bool,
  defaultValue: PropTypes.arrayOf(PropTypes.number),
};

TimeRangeSlider.defaultProps = {
  min: defaultTimeRange[0],
  max: defaultTimeRange[1],
  isValueLabelled: true,
  defaultValue: defaultTimeRange,
};


export default withForwardedRef(TimeRangeSlider);
