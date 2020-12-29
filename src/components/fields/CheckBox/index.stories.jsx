import React, { useState, Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { Checkbox as CheckboxComponent } from 'components/fields';
import { Description } from '../../storybook';

export default { title: 'Fields' };

const tooltip =
  `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid assumenda autem,
  blanditiis corporis distinctio doloremque earum facilis harum ipsa, ipsam,
  laboriosam nemo nostrum nulla perferendis quasi unde vel velit voluptatibus.`;

const onChangeAction = action('onChange');

export const Checkbox = () => {
  const [value1, setValue1] = useState(false);
  const [value2, setValue2] = useState(true);
  const [value3, setValue3] = useState(false);

  const handleChange1 = (e) => {
    setValue1(!value1);
    onChangeAction(e);
  };

  const handleChange2 = (e) => {
    setValue2(!value2);
    onChangeAction(e);
  };

  const handleChange3 = (e) => {
    setValue3(!value3);
    onChangeAction(e);
  };

  return (
    <Fragment>
      <Description>Чекбокс по умолчанию (with state)</Description>
      <CheckboxComponent value={value1} name="name1" checked={value1} onChange={handleChange1} />
      <Description>Чекбокс включённый c label (with state)</Description>
      <CheckboxComponent value={value2} name="name2" onChange={handleChange2} label="Чекбокс 2" />
      <Description>Чекбокс выключенный c label и tooltip (with state)</Description>
      <CheckboxComponent value={value3} name="name3" onChange={handleChange3} label="Чекбокс 3" tooltip={tooltip} />
    </Fragment>
  );
};
