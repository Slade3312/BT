import React from 'react';
import RadioGroup from '../RadioGroup';
import RadioButtonChip from '../_parts/RadioButtonChip';

export default function RadioDefaultGroup(props) {
  return (
    <RadioGroup ItemComponent={RadioButtonChip} {...props} />
  );
}
