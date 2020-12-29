import React, { Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import BackLinkComponent from 'components/buttons/BackLink';
import { Description } from '../../storybook';

export default { title: 'Buttons' };

const onClickAction = action('onClick');

export const BackLink = () => (
  <Fragment>
    <Description>Кнопка по умолчанию</Description>
    <BackLinkComponent onClick={onClickAction}>Text</BackLinkComponent>
  </Fragment>
);
