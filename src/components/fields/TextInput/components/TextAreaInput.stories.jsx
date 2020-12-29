import React, { useState, Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { Description } from 'components/storybook/index';
import TextAreaInputComponent from './TextAreaInput';

export default { title: 'Fields/TextFields' };

const placeholder = 'введите значение';

const onChangeAction = action('onChange');

export const TextAreaInput = () => {
  const [value1, setValues1] = useState('');

  const handleChange1 = (value) => {
    setValues1(value);
    onChangeAction(value);
  };

  return (
    <Fragment>
      <Description>Text area c placeholder </Description>
      <TextAreaInputComponent
        size="default"
        onChange={handleChange1}
        value={value1}
        placeholder={placeholder}
        name="name1"
      />
    </Fragment>
  );
};
