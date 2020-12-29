import React, { useState, Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { Description } from 'components/storybook';
import { SmartCheckBoxGroup as SmartCheckBoxGroupComponent } from 'components/fields';

export default { title: 'Fields' };

const options1 = [...Array(5).keys()].map(i => ({
  label: `label ${i}`,
  id: String(i),
  tooltip: `tooltip ${i}`,
}));

const onChangeAction = action('onChange');

export const SmartCheckBoxGroup = () => {
  const [value1, setValue1] = useState([]);

  const handleChange1 = (val) => {
    setValue1(val);
    onChangeAction(val);
  };

  return (
    <Fragment>
      <Description>Чекбокс группа c тултипами</Description>
      <SmartCheckBoxGroupComponent
        value={value1}
        name="name1"
        label="Чекбокс 1"
        checked={value1}
        options={options1}
        onChange={handleChange1}
      />
    </Fragment>
  );
};
