import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { action, toJS } from 'mobx';
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
import { StoresContext } from 'store/mobx';
import { FinalForm } from 'components/forms/FinalForm';
import {
  ORDER_BUDGET_FIELD,
  ORDER_DATE,
  ORDER_MESSAGE_FIELD, ORDER_START_DATE_FIELD,
  ORDER_TARGET_ACTION,
  ORDER_URL_ADVERTISER_FIELD,
} from 'store/NewCampaign/channels/constants';
import { formatPrice } from 'utils/formatting';
import { usePushDatesValidators } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/usePushDatesValidators';
import { DateValidatorsContext } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/channelsContext';
import { PUSH_TARGET_ACTIONS } from '../../constants';

function PushOrderForm({ className, children }) {
  const { NewCampaign, WebsAndPhonesTaxons } = useContext(StoresContext);
  const values = NewCampaign.currentCampaign.currentOrder;

  const dateValidators = usePushDatesValidators();
  const minBudget = formatPrice(NewCampaign.currentCampaign.currentOrder.minimalBudget);

  const { [ORDER_TARGET_ACTION]: targetAction } = values;

  const getValidators = () => ({
    ...WebsAndPhonesTaxons.webSitesOnOfLine === 'online' ? {
      [ORDER_START_DATE_FIELD]: [composeRequiredValidator('Дата старта — обязательное поле')],
    } : {
      [ORDER_DATE]: [
        composeDateRequiredValidator(['Дата старта — обязательное поле', 'Дата завершения — обязательное поле']),
        composeStartDateValidator('Выберите доступную дату старта из календаря', dateValidators.countMinStartDate()),
      ],
    },
    [ORDER_BUDGET_FIELD]: [
      composeNumberValidator(`Сумма не может быть ниже ${minBudget} ₽`, { min: NewCampaign.currentCampaign.currentOrder.minimalBudget }),
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
        values={toJS(values)}
        className={className}
        onChange={action(data => {
          if (data.targetAction !== NewCampaign.currentCampaign.currentOrder.targetAction) {
            NewCampaign.checkForAudiencePushAndroid(data.targetAction);
          }
          NewCampaign.currentCampaign.currentOrder = data;
        })}
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

export default observer(PushOrderForm);
