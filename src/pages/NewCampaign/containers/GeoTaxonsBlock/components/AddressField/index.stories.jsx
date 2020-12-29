import React, { Fragment } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, select, object } from '@storybook/addon-knobs';
import { Description } from 'components/storybook/index';
import AddressField from './index';

export default {
  title: 'AddressField',
  decorators: [withKnobs],
};

const RADIUS_OPTIONS = [1000, 2000, 3000, 4000, 5000];

const onAddressChange = action('onAddressChange');
const onRadiusChange = action('onRadiusChange');
const onAddAddressClick = action('onAddAddressClick');

export const GeoAddressField = () => {
  const randomId = String(Math.random()).split('.')[1];

  const radiusValues = select('radiusValues', RADIUS_OPTIONS, 1000);

  const textData = object('templatesData', {
    tooltip: 'описание',
    label: 'Укажите точный адрес',
    radiusLabel: 'Радиус (км)',
    buttonText: 'Добавить адрес',
    inputPlaceholder: 'Введите точный адрес',
  });

  return (
    <Fragment>
      <Description>Поле ввода конкретного адреса.</Description>

      <AddressField
        templatesData={textData}
        error={text('addressInputError', '')}
        value={text('addressInputValue', '')}
        radiusValue={radiusValues}
        activeFieldIndex={-1}
        onAddressChange={onAddressChange}
        onRadiusChange={onRadiusChange}
        onAddAddressClick={onAddAddressClick}
        id={randomId}
        index={-1}
      />
    </Fragment>
  );
};
