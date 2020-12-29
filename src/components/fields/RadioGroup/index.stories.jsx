import React, { useState, Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { RadioGroup as RadioGroupComponent } from 'components/fields';
import { Description } from 'components/storybook/index';

export default { title: 'Fields' };

const options = [...Array(5).keys()].map(i => ({
  label: `label ${i}`,
  value: String(i),
  tooltip: `tooltip ${i}`,
}));

export const RadioGroup = () => {
  const [value1, setValue1] = useState('2');
  const [value3, setValue3] = useState('0');

  const action1 = action('onChange');
  const action2 = action('onChange');
  const action3 = action('onChange');

  const handleChange1 = (val) => {
    setValue1(val);
    action1(val);
  };
  const handleChange2 = (val) => {
    action2(val);
  };
  const handleChange3 = (val) => {
    setValue3(val);
    action3(val);
  };

  return (
    <Fragment>
      <Description>Радиогруппа value=2 (with state)</Description>
      <RadioGroupComponent
        options={options}
        name="name1"
        value={value1}
        onChange={handleChange1}
      />
      <Description>Радиогруппа default value=1 (without state)</Description>
      <RadioGroupComponent
        defaultValue="1"
        options={options}
        name="name2"
        onChange={handleChange2}
      />
      <Description>Радиогруппа isVertical (with state)</Description>
      <RadioGroupComponent
        isVertical
        options={options}
        name="name3"
        value={value3}
        onChange={handleChange3}
      />
    </Fragment>
  );
};
