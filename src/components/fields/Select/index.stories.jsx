import React, { useState, Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { Description } from 'components/storybook/index';

import MultiSelect from './components/MultiSelect';
import Select from './components/Select';

export default { title: 'Fields' };

const SELECT_VALUES = [...Array(5).keys()].map(i => String(i));

const SELECT_OPTIONS = SELECT_VALUES.map(item => ({
  label: `label ${item}`,
  value: item,
}));

export const Selects = () => {
  const [selectValue, setSelectValue] = useState('1');
  const [multiSelectValue, setMultiSelectValue] = useState('0');

  const selectChangeAction = action('onSelectChange');
  const multiSelectChangeAction = action('onMultiSelectChange');

  const handleSelectChange = (val) => {
    setSelectValue(val);
    selectChangeAction(val);
  };
  const handleMultiSelectChange = (val) => {
    setMultiSelectValue(val);
    multiSelectChangeAction(val);
  };

  return (
    <Fragment>
      <Description>Выбор элемента из выпадающего списка</Description>
      <Select
        name="select"
        value={selectValue}
        options={SELECT_OPTIONS}
        onChange={handleSelectChange}
      />

      <Description>Одновременный выбор нескольких элементов</Description>
      <MultiSelect
        name="multiSelect"
        value={multiSelectValue}
        options={SELECT_OPTIONS}
        onChange={handleMultiSelectChange}
      />
    </Fragment>
  );
};
