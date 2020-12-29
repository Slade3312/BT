import React, { useState, Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { Description } from 'components/storybook/index';
import SearchInputComponent from './SearchInput';

export default { title: 'Fields/TextFields' };

const placeholder = 'введите значение';

const onChangeAction = action('onChange');

export const SearchInput = () => {
  const [value1, setValues1] = useState('');

  const handleChange1 = (value) => {
    setValues1(value);
    onChangeAction(value);
  };

  return (
    <Fragment>
      <Description>Поле c placeholder </Description>
      <SearchInputComponent
        onChange={handleChange1}
        value={value1}
        placeholder={placeholder}
        name="name1"
      />
    </Fragment>
  );
};
