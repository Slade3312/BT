import React, { useState, Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { Description } from 'components/storybook/index';
import TextInputComponent from './TextInput';

export default { title: 'Fields/TextFields' };

const placeholder = 'введите значение';

const onChangeAction = action('onChange');

export const TextInput = () => {
  const [value1, setValues1] = useState('');
  const [value2, setValues2] = useState('');

  const handleChange1 = (value) => {
    setValues1(value);
    onChangeAction(value);
  };
  const handleChange2 = (value) => {
    setValues2(value);
    onChangeAction(value);
  };

  return (
    <Fragment>
      <Description>Поле c placeholder </Description>
      <TextInputComponent
        size="default"
        onChange={handleChange1}
        value={value1}
        placeholder={placeholder}
        name="name1"
      />
      <Description>Поле big size c placeholder </Description>
      <TextInputComponent
        size="big"
        onChange={handleChange2}
        value={value2}
        placeholder={placeholder}
        name="name2"
      />
    </Fragment>
  );
};
