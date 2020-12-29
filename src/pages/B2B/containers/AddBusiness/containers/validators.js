import {
  composeRequiredValidator,
  composePhoneValidator,
  composeUrlValidator,
  composeHttpValidator,
  composeOnlyNumberValidator,
  composeLengthValidator,
  composeSignAfterDotValidator,
} from 'utils/fieldValidators';

import Tinder, { FIRSTSTEP, SECONDSTEP } from 'store/mobx/Tinder';


export const getValidatorsFirstStep = () => ({
  [FIRSTSTEP.NAME]: [
    composeRequiredValidator('Обязательное поле'),
    composeLengthValidator('Не более 32 символов', { max: 32 }),
  ],
  [FIRSTSTEP.PHONE]: [
    composeRequiredValidator('Обязательное поле'),
    composePhoneValidator('Номер телефона должен быть заполнен в формате 9XXXXXXXXX'),
  ],
  [FIRSTSTEP.INDUSTRY]: [
    composeRequiredValidator('Обязательное поле'),
  ],
  [FIRSTSTEP.SITE]: [
    composeUrlValidator('Строка не является валидным веб-адресом'),
    composeHttpValidator('Адрес должен начинаться с http:// или https://'),
  ],
  [FIRSTSTEP.DESCRIPTION]: [
    composeRequiredValidator('Обязательное поле'),
    composeLengthValidator('Не более 512 символов', { max: 512 }),
  ],
});

export const getValidatorsSecondStep = () => ({
  [SECONDSTEP.NAME]: [
    composeRequiredValidator('Обязательное поле'),
    composeLengthValidator('Не более 32 символов', { max: 32 }),
  ],
  [SECONDSTEP.DESCRIPTION]: [
    composeRequiredValidator('Обязательное поле'),
    composeLengthValidator('Не более 512 символов', { max: 512 }),
  ],
  [SECONDSTEP.ACTION_SIZE]: [
    composeRequiredValidator('Обязательное поле'),
    composeSignAfterDotValidator('Не более 2 знаков после точки', 2),
    composeOnlyNumberValidator({
      typeMessage: 'Допускаются только числа',
      sizeMessage: Tinder.secondStepValues.discount_type === 1 && 'от 0 до 100' || '1 000 000 000' }, { max: Tinder.secondStepValues.discount_type === 1 && 100 || 1000000000 }),
  ],
  [SECONDSTEP.END_DATE]: [
    composeRequiredValidator('Обязательное поле'),
  ],
  [SECONDSTEP.START_DATE]: [
    composeRequiredValidator('Обязательное поле'),
  ],
});

