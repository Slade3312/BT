import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  composeRequiredValidator,
  composeUrlValidator,
  composeHttpValidator,
  composeArrayFieldLengthValidator,
  composeNumberValidator,
  composeDateRequiredValidator,
  composeStartDateValidator,
  composeLengthValidator,
} from 'utils/fieldValidators';
import { CHANNEL_STUB_INTERNET } from 'constants/index';
import { getInternetOrderFormValues } from 'store/NewCampaign/channels/selectors';
import {
  ORDER_URL_ADVERTISER_FIELD,
  ORDER_TOOLS_FIELD,
  MIN_SELECTED_INTERNET_INSTRUMENTS,
  ORDER_CHOSEN_TARIFF,
  ORDER_INDUSTRY_FIELD,
  ORDER_BUDGET_FIELD,
  ORDER_DATE,
  ORDER_ADD_INFO_FIELD,
} from 'store/NewCampaign/channels/constants';
import { getCommonCampaignChannelTypesById } from 'store/common/campaign/selectors';
import { FinalForm } from 'components/forms/FinalForm';

import { formatPrice } from 'utils/formatting';
import { syncOrderDataAndEvents } from 'store/NewCampaign/storage/actions/sync';
import { INTERNET_ORDER_FORM_ID } from 'pages/NewCampaign/constants';
import { useInternetDatesValidators } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/useInternetDatesValidators';
import { DateValidatorsContext } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/channelsContext';
import { actualizeFormWithDetectionOverdue, composeArrayToolsMinBudget } from './utils';

export default function InternetOrderForm({ children, className }) {
  const dispatch = useDispatch();

  const channelData = useSelector(getCommonCampaignChannelTypesById)[CHANNEL_STUB_INTERNET];
  const minBudget = formatPrice(channelData.minimal_budget);

  const values = useSelector(getInternetOrderFormValues);
  const dateValidators = useInternetDatesValidators();

  const getValidators = () => ({
    [ORDER_BUDGET_FIELD]: [
      composeNumberValidator(`Сумма не может быть ниже ${minBudget} ₽`, { min: channelData.minimal_budget }),
    ],
    [ORDER_DATE]: [
      composeDateRequiredValidator(['Дата старта — обязательное поле', 'Дата завершения — обязательное поле']),
      composeStartDateValidator('Выберите доступную дату старта из календаря', dateValidators.countMinStartDate()),
    ],
    [ORDER_ADD_INFO_FIELD]: [composeLengthValidator('Длина текста должна быть не более 200 символов', { max: 200 })],
    [ORDER_TOOLS_FIELD]: [
      composeArrayFieldLengthValidator(
        `Должен быть выбран как минимум ${MIN_SELECTED_INTERNET_INSTRUMENTS} инструмент`,
        {
          minLength: MIN_SELECTED_INTERNET_INSTRUMENTS,
        },
      ),
      composeArrayToolsMinBudget(null, { minBudget: channelData.minimal_budget }),
    ],
    [ORDER_CHOSEN_TARIFF]: [composeRequiredValidator('Необходимо выбрать тариф')],
    [ORDER_INDUSTRY_FIELD]: [composeRequiredValidator('Обязательное поле')],
    [ORDER_URL_ADVERTISER_FIELD]: [
      composeRequiredValidator('Обязательное поле'),
      composeUrlValidator('Строка не является валидным веб-адресом'),
      composeHttpValidator('Адрес должен начинаться с http:// или https://'),
      composeLengthValidator('Длина урл должна быть не более 255 символов', { max: 255 }),
    ],
  });

  const handleProxyValues = (vals) => {
    actualizeFormWithDetectionOverdue(vals, dispatch);
    return vals;
  };

  return (
    <DateValidatorsContext.Provider value={dateValidators}>
      <FinalForm
        values={values}
        className={className}
        onChange={data => dispatch(syncOrderDataAndEvents(CHANNEL_STUB_INTERNET, data))}
        onFormChangeProxy={handleProxyValues}
        id={INTERNET_ORDER_FORM_ID}
        getValidators={getValidators}
      >
        {children}
      </FinalForm>
    </DateValidatorsContext.Provider>
  );
}

InternetOrderForm.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
