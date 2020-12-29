import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import {
  composeNumberValidator,
  composeDateRequiredValidator,
  composeStartDateValidator,
  composeActivityValidator,
} from 'utils/fieldValidators';

import { VOICE_TARGET_ORDER_FORM_ID } from 'pages/NewCampaign/constants';
import { FinalForm } from 'components/forms/FinalForm';
import {
  ACTIVITY_FIELD,
  ORDER_BUDGET_FIELD,
  ORDER_CONNECTION_TYPE,
  ORDER_DATE,
} from 'store/NewCampaign/channels/constants';
import { CHANNEL_STUB_VOICE } from 'constants/index';
import { formatPrice } from 'utils/formatting';
import { useVoiceDatesValidators } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/useVoiceDatesValidators';
import { DateValidatorsContext } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/channelsContext';
import { StoresContext } from 'store/mobx';

function VoiceOrderForm({ className, children }) {
  const { NewCampaign } = useContext(StoresContext);
  const dateValidators = useVoiceDatesValidators();
  let minBudget = NewCampaign.currentCampaign.currentOrder.minimalBudget;
  const { [ORDER_CONNECTION_TYPE]: connectionType } = NewCampaign.currentCampaign.currentOrder;

  if (connectionType !== 1) {
    minBudget = 100000;
  }

  const getValidators = () => ({
    [ORDER_BUDGET_FIELD]: [
      composeNumberValidator(`Сумма не может быть ниже ${formatPrice(minBudget)} ₽`, { min: NewCampaign.currentCampaign.currentOrder.minimalBudget }),
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
        values={NewCampaign.currentCampaign.currentOrder}
        className={className}
        onChange={action(data => {
          NewCampaign.currentCampaign.currentOrder = data;
        })}
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

export default observer(VoiceOrderForm);
