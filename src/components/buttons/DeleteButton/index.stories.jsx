import React, { Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import DeleteButtonComponent from 'components/buttons/DeleteButton';
import { Description } from '../../storybook';

export default { title: 'Buttons' };

const onClickAction = action('onClick');

export const DeleteButton = () => (
  <Fragment>
    <Description>Кнопка по умолчанию</Description>
    <DeleteButtonComponent onClick={onClickAction} />
    <Description>Кнопка с isDisabled</Description>
    <DeleteButtonComponent isDisabled onClick={onClickAction} />
  </Fragment>
);
