import React, { useState, Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { Switch as SwitchComponent } from 'components/fields';
import { Description } from 'components/storybook/index';

export default { title: 'Fields' };

const onChangeAction = action('onChange');

export const Switch = () => {
  const [value1, setValue1] = useState(false);
  const [value2, setValue2] = useState(true);
  const [value3, setValue3] = useState(true);
  const [value4, setValue4] = useState(true);
  const [value5, setValue5] = useState(true);

  const handleChange1 = (val) => {
    setValue1(val);
    onChangeAction(val);
  };

  const handleChange2 = (val) => {
    setValue2(val);
    onChangeAction(val);
  };
  const handleChange3 = (val) => {
    setValue3(val);
    onChangeAction(val);
  };

  const handleChange4 = (val) => {
    setValue4(val);
    onChangeAction(val);
  };

  const handleChange5 = (val) => {
    setValue5(val);
    onChangeAction(val);
  };

  return (
    <Fragment>
      <Description>Переключатель выключенный (with state)</Description>
      <SwitchComponent name="name1" value={value1} onChange={handleChange1} />
      <Description>Переключатель включённый (with state)</Description>
      <SwitchComponent name="name2" value={value2} onChange={handleChange2} />
      <Description>Переключатель isLoading</Description>
      <SwitchComponent name="name3" value={value3} isLoading onChange={handleChange3} />
      <Description>Переключатель disabled</Description>
      <SwitchComponent name="name4" value={value4} disabled onChange={handleChange4} />
      <Description>Переключатель isFuture</Description>
      <SwitchComponent name="name5" value={value5} isFuture onChange={handleChange5} />
    </Fragment>
  );
};
