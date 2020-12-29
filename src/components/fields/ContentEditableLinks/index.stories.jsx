import React, { useState, Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text } from '@storybook/addon-knobs';
import { Description } from 'components/storybook/index';

import ContentEditableLinks from './index';

export default {
  title: 'ContentEditableLinks',
  decorators: [withKnobs],
};

const onValueChange = action('onValueChange');
const onFieldBlur = action('onFieldBlur');

export const ContentEditableLinksField = () => {
  const [value, setValue] = useState({});

  const handleChange = (newValue) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  const handleBlur = (newBlurValue) => {
    handleChange(newBlurValue);
    onValueChange(newBlurValue);
    onFieldBlur(newBlurValue);
  };

  return (
    <Fragment>
      <Description>Поле ввода текста SMS-сообщения.</Description>

      <ContentEditableLinks
        placeholder={text('placeholder', '')}
        name="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </Fragment>
  );
};
