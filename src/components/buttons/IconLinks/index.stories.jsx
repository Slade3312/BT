import React, { Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { IconLink as IconLinkComponent } from 'components/buttons/IconLinks';
import { Description } from '../../storybook';

export default { title: 'Buttons' };

const onClickAction = action('onClick');

export const IconLinks = () => (
  <Fragment>
    <Description>Кнопка по умолчанию</Description>
    <IconLinkComponent onClick={onClickAction}>Text</IconLinkComponent>
    <Description>Кнопка isDisabled</Description>
    <IconLinkComponent isDisabled onClick={onClickAction}>
      Text
    </IconLinkComponent>
    <Description>Кнопка isCompact</Description>
    <IconLinkComponent isCompact onClick={onClickAction}>
      Text
    </IconLinkComponent>
    <Description>Кнопка c href ссылкой</Description>
    <IconLinkComponent href="https://google.com" onClick={onClickAction}>
      Text
    </IconLinkComponent>
    <Description>Кнопка cо slug иконкой</Description>
    <IconLinkComponent slug="arrowRightLong" onClick={onClickAction}>
      Text
    </IconLinkComponent>
    <Description>Кнопка c isIconAfterText и slug иконкой</Description>
    <IconLinkComponent isIconAfterText slug="arrowCircled" onClick={onClickAction}>
      Text
    </IconLinkComponent>
  </Fragment>
);
