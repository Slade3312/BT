import React, { Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { ActionButton as ActionButtonComponent } from 'components/buttons/ActionButtons';

import { Description } from '../../storybook';

export default {
  title: 'Buttons',
  decorators: [withKnobs],
};

const onClickAction = action('onClick');

export const ActionButton = () => (
  <Fragment>
    <Description>Кнопка isLight</Description>
    <ActionButtonComponent
      isLight={boolean('isLight', false)}
      isDisabled={boolean('isDisabled', false)}
      isGrowing={boolean('isGrowing', false)}
      iconSlug={text('iconSlug', 'arrowRightLong')}
      onClick={onClickAction}
    >
      {text('Text', 'Нажми меня')}
    </ActionButtonComponent>

    <Description>Кнопка isDisabled</Description>
    <ActionButtonComponent isDisabled onClick={onClickAction}>
      Text
    </ActionButtonComponent>

    <Description>Кнопка isGrowing</Description>
    <ActionButtonComponent isGrowing onClick={onClickAction}>
      Text
    </ActionButtonComponent>

    <Description>Кнопка c иконкой</Description>
    <ActionButtonComponent iconSlug="arrowRightLong" onClick={onClickAction}>
      Text
    </ActionButtonComponent>
  </Fragment>
);
