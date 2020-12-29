import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import {
  composeNumberValidator,
  composeDateRequiredValidator,
  composeStartDateValidator,
  composeActivityValidator,
} from 'utils/fieldValidators';

import { VOICE_TARGET_ORDER_FORM_ID } from 'pages/NewCampaign/constants';
import { syncOrderDataAndEvents } from 'store/NewCampaign/storage/actions/sync';
import { FinalForm } from 'components/forms/FinalForm';
import {
  ACTIVITY_FIELD,
  ORDER_BUDGET_FIELD,
  ORDER_CONNECTION_TYPE,
  ORDER_DATE,
} from 'store/NewCampaign/channels/constants';
import { getVoiceOrderFormValues } from 'store/NewCampaign/channels/selectors';
import { CHANNEL_STUB_VOICE } from 'constants/index';
import { formatPrice } from 'utils/formatting';
import { getCommonCampaignChannelTypesById } from 'store/common/campaign/selectors';
import { useVoiceDatesValidators } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/useVoiceDatesValidators';
import { DateValidatorsContext } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/channelsContext';

export default function VoiceOrderForm({ className, children }) {
  const dispatch = useDispatch();
  const values = useSelector(getVoiceOrderFormValues);
  const dateValidators = useVoiceDatesValidators();

  const channelData = useSelector(getCommonCampaignChannelTypesById)[CHANNEL_STUB_VOICE];
  let minBudget = channelData.minimal_budget;
  const { [ORDER_CONNECTION_TYPE]: connectionType } = values;

  if (connectionType !== 1) {
    minBudget = 100000;
  }

  const getValidators = () => ({
    [ORDER_BUDGET_FIELD]: [
      composeNumberValidator(`Сумма не может быть ниже ${formatPrice(minBudget)} ₽`, { min: minBudget }),
    ],
    [ACTIVITY_FIELD]: [
      composeActivityValidator('Укажите отрасль, тип товара или услуги, чтобы расчитать стоимость', connectionType),
    ],
    [ORDER_DATE]: [
      composeDateRequiredValidator(['Дата старта — обязательное поле', 'Дата завершения — обязательное поле']),
      composeStartDateValidator('Выберите доступную дату старта из календаря', dateValidators.countMinStartDate()),
    ],
  });

  return (
    <DateValidatorsContext.Provider value={dateValidators}>
      <FinalForm
        values={values}
        className={className}
        onChange={data => dispatch(syncOrderDataAndEvents(CHANNEL_STUB_VOICE, data))}
        id={VOICE_TARGET_ORDER_FORM_ID}
        getValidators={getValidators}
      >
        {children}
      </FinalForm>
    </DateValidatorsContext.Provider>
  );
}

VoiceOrderForm.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};
