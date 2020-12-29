import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  composeRequiredValidator,
  composeUrlGooglePlayValidator,
  composeUrlWithoutGameServices,
  composeLengthValidator,
  composeUrlValidator,
  composeNumberValidator,
  composeDateRequiredValidator,
  composeStartDateValidator,
} from 'utils/fieldValidators';

import { PUSH_ORDER_FORM_ID } from 'pages/NewCampaign/constants';
import { syncOrderDataAndEvents } from 'store/NewCampaign/storage/actions/sync';
import { FinalForm } from 'components/forms/FinalForm';
import {
  ORDER_BUDGET_FIELD,
  ORDER_DATE,
  ORDER_MESSAGE_FIELD,
  ORDER_TARGET_ACTION,
  ORDER_URL_ADVERTISER_FIELD,
} from 'store/NewCampaign/channels/constants';
import { getPushOrderFormValues } from 'store/NewCampaign/channels/selectors';
import { CHANNEL_STUB_PUSH } from 'constants/index';
import { formatPrice } from 'utils/formatting';
import { getCommonCampaignChannelTypesById } from 'store/common/campaign/selectors';
import { usePushDatesValidators } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/usePushDatesValidators';
import { DateValidatorsContext } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/channelsContext';
import { PUSH_TARGET_ACTIONS } from '../../constants';

export default function PushOrderForm({ className, children }) {
  const dispatch = useDispatch();
  const values = useSelector(getPushOrderFormValues);
  const dateValidators = usePushDatesValidators();

  const channelData = useSelector(getCommonCampaignChannelTypesById)[CHANNEL_STUB_PUSH];
  const minBudget = formatPrice(channelData.minimal_budget);

  const { [ORDER_TARGET_ACTION]: targetAction } = values;

  const getValidators = () => ({
    [ORDER_BUDGET_FIELD]: [
      composeNumberValidator(`Сумма не может быть ниже ${minBudget} ₽`, { min: channelData.minimal_budget }),
    ],
    [ORDER_DATE]: [
      composeDateRequiredValidator(['Дата старта — обязательное поле', 'Дата завершения — обязательное поле']),
      composeStartDateValidator('Выберите доступную дату старта из календаря', dateValidators.countMinStartDate()),
    ],
    [ORDER_MESSAGE_FIELD]: [composeRequiredValidator('Обязательное поле'), composeLengthValidator(true, { max: 70 })],
    [ORDER_URL_ADVERTISER_FIELD]:
      targetAction === PUSH_TARGET_ACTIONS.FOLLOW_LINK
        ? [
          composeRequiredValidator('Обязательное поле'),
          composeUrlValidator('Строка не является валидным веб-адресом'),
          // eslint-disable-next-line max-len
          composeLengthValidator('Длина урл должна быть не более 200 символов', { max: 200 }),
          composeUrlWithoutGameServices('URL не должен соответствовать адресу страницы сервисов Google Play или AppStore'),
        ]
        : [
          composeRequiredValidator('Обязательное поле'),
          composeUrlValidator('Строка не является валидным веб-адресом'),
          composeUrlGooglePlayValidator('Строка не является валидным веб-адресом Google Play'),
          composeLengthValidator('Длина урл должна быть не более 200 символов', { max: 200 }),
        ],
  });

  return (
    <DateValidatorsContext.Provider value={dateValidators}>
      <FinalForm
        values={values}
        className={className}
        onChange={data => dispatch(syncOrderDataAndEvents(CHANNEL_STUB_PUSH, data))}
        id={PUSH_ORDER_FORM_ID}
        getValidators={getValidators}
      >
        {children}
      </FinalForm>
    </DateValidatorsContext.Provider>
  );
}

PushOrderForm.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
