import React from 'react';
import RadioGroup from '../RadioGroup';
import BoxRadioButton from '../_parts/RadioBoxButton';

export default function RadioBoxGroup(props) {
  return (
    <RadioGroup ItemComponent={BoxRadioButton} {...props} />
  );
}
