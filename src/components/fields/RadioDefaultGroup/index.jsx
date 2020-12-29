import React from 'react';
import RadioGroup from '../RadioGroup';
import RadioDefaultButton from '../_parts/RadioDefaultButton';

export default function RadioDefaultGroup(props) {
  return (
    <RadioGroup ItemComponent={RadioDefaultButton} {...props} />
  );
}
