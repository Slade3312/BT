import {
  composeRequiredValidator,
  composePhoneValidator,
  composeUrlValidator,
  composeHttpValidator,
} from 'utils/fieldValidators';

import { FIRSTSTEP } from 'store/mobx/Tinder';

export const getValidatorsFirstStep = () => ({
  [FIRSTSTEP.NAME]: [
    composeRequiredValidator('Обязательное поле'),
  ],
  [FIRSTSTEP.PHONE]: [
    composeRequiredValidator('Обязательное поле'),
    composePhoneValidator('Номер телефона должен быть заполнен в формате 9XXXXXXXXX'),
  ],
  [FIRSTSTEP.INDUSTRY]: [
    composeRequiredValidator('Обязательное поле'),
  ],
  [FIRSTSTEP.SITE]: [
    composeRequiredValidator('Обязательное поле'),
    composeUrlValidator('Строка не является валидным веб-адресом'),
    composeHttpValidator('Адрес должен начинаться с http:// или https://'),
  ],
  [FIRSTSTEP.DESCRIPTION]: [
    composeRequiredValidator('Обязательное поле'),
  ],
});
