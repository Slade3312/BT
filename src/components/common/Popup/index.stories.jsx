import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { PopupStateless as PopupStatelessComponent } from 'components/common';
import { Description } from 'components/storybook';

export default {
  title: 'PopupStateless',
  decorators: [withKnobs],
};

const onCloseAction = action('onClose');

export const PopupStateless = () => {
  const isOpen = boolean('isOpen', true);

  return (
    <React.Fragment>
      <Description>PopupStateless: </Description>

      <PopupStatelessComponent
        opened={isOpen}
        onClose={onCloseAction}
      >
        {text('content', 'Внутренний контент')}
      </PopupStatelessComponent>
    </React.Fragment>
  );
};
