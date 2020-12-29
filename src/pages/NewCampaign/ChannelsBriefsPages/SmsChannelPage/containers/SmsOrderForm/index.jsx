import React, { useMemo, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { observer } from 'mobx-react';
import { getSmsOrderFormValues } from 'store/NewCampaign/channels/selectors';
import { StoresContext } from 'store/mobx';
import { syncOrderDataAndEvents } from 'store/NewCampaign/storage/actions/sync';
import { getCommonCampaignChannelTypesById } from 'store/common/campaign/selectors';
import {
  composeRequiredValidator,
  composeSlugValidator,
  composeLengthValidator,
  composeArrayRequiredValidator,
  composeNumberValidator,
  composeDateRequiredValidator,
  composeStartDateValidator,
  composeOnlineGeoValidator,
} from 'utils/fieldValidators';
import { composeOrderSenderNameRegexpValidator } from 'pages/NewCampaign/ChannelsBriefsPages/helpers';
import {
  ORDER_SENDER_NAME_FIELD,
  ORDER_MESSAGE_FIELD,
  ORDER_FILES_FIELD,
  ORDER_SENDING_FIELD,
  SMS_MESSAGE_MAX_LENGTH,
  ORDER_BUDGET_FIELD,
  ORDER_DATE,
  GEO_POINTS,
  USE_ONLINE_GEO,
} from 'store/NewCampaign/channels/constants';

import { useSmsDatesValidators } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/useSmsDatesValidators';
import { DateValidatorsContext } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/channelsContext';
import { SMS_ORDER_FORM_ID } from 'pages/NewCampaign/constants';
import { convertEmulatorMessage } from 'pages/NewCampaign/utils';
import { CHANNEL_STUB_SMS } from 'constants/index';
import { FinalForm } from 'components/forms/FinalForm';
import { formatPrice } from 'utils/formatting';
import { getSmsBriefFormOrder } from 'store/common/templates/newCampaign/briefs-selectors';

const orderMessageFieldGetter = value => value && value.text;

function SmsOrderForm({ className, children }) {
  const dispatch = useDispatch();
  let values = useSelector(getSmsOrderFormValues);
  const { UserInfo } = useContext(StoresContext);
  if (UserInfo?.data?.company?.inn && UserInfo?.data?.company?.self_employed === true) {
    values = {
      ...values,
      [ORDER_SENDER_NAME_FIELD]: 'BrandInfo',
    };
  }
  const dateValidators = useSmsDatesValidators();
  const { onlineGeo } = useSelector(getSmsBriefFormOrder);
  const {
    [ORDER_MESSAGE_FIELD]: message,
    [USE_ONLINE_GEO]: use_online_geo,
  } = values;

  const emulatorText = useMemo(() => convertEmulatorMessage(message) || '', [message]);

  const channelData = useSelector(getCommonCampaignChannelTypesById)[CHANNEL_STUB_SMS];
  const minBudget = formatPrice(channelData.minimal_budget);
  const getValidators = useCallback(
    () => ({
      [ORDER_BUDGET_FIELD]: [
        composeNumberValidator(`Сумма не может быть ниже ${minBudget} ₽`, { min: channelData.minimal_budget }),
      ],
      [ORDER_DATE]: [
        composeDateRequiredValidator(['Дата старта — обязательное поле', 'Дата завершения — обязательное поле']),
        composeStartDateValidator('Выберите доступную дату старта из календаря', dateValidators.countMinStartDate()),
      ],
      [ORDER_SENDER_NAME_FIELD]: [
        composeRequiredValidator('Обязательное поле'),
        composeSlugValidator('Должна быть хотя бы одна буква'),
        composeLengthValidator('Длина имени должна быть от 2 до 11 символов', { min: 2, max: 11 }),
        composeOrderSenderNameRegexpValidator('Имя должно быть без пробелов и может содержать только латинские символы и цифры'),
      ],
      [ORDER_MESSAGE_FIELD]: [
        composeRequiredValidator('Обязательное поле', orderMessageFieldGetter),
        composeLengthValidator(
          true,
          { max: SMS_MESSAGE_MAX_LENGTH },
          () => emulatorText,
        ),
      ],
      [ORDER_FILES_FIELD]: [composeArrayRequiredValidator('Обязательное поле')],
      [USE_ONLINE_GEO]: null,
      [GEO_POINTS]: [composeOnlineGeoValidator(onlineGeo.error, use_online_geo)],
      [ORDER_SENDING_FIELD]: null,
    }),
    [values, emulatorText],
  );

  return (
    <DateValidatorsContext.Provider value={dateValidators}>
      <FinalForm
        values={values}
        className={className}
        onChange={data => dispatch(syncOrderDataAndEvents(CHANNEL_STUB_SMS, data))}
        id={SMS_ORDER_FORM_ID}
        getValidators={getValidators}
      >
        {children}
      </FinalForm>
    </DateValidatorsContext.Provider>
  );
}

SmsOrderForm.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export default observer(SmsOrderForm);
