import React, { Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import PureButtonComponent from 'components/buttons/PureButton';
import { Description } from '../../storybook';

export default { title: 'Buttons' };

const onClickAction = action('onClick');

export const PureButton = () => (
  <Fragment>
    <Description>Кнопка по умолчанию type=button</Description>
    <PureButtonComponent onClick={onClickAction}>Text</PureButtonComponent>
    <Description>Кнопка type=submit</Description>
    <PureButtonComponent onClick={onClickAction} type="submit">Text</PureButtonComponent>
  </Fragment>
);
