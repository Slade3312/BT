import React, { useMemo, useContext } from 'react';
import { action, toJS } from 'mobx';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useForm } from 'react-final-form';
import { StoresContext } from 'store/mobx';
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
  ORDER_START_DATE_FIELD,
} from 'store/NewCampaign/channels/constants';

import { useSmsDatesValidators } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/useSmsDatesValidators';
import { DateValidatorsContext } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/channelsContext';
import { SMS_ORDER_FORM_ID } from 'pages/NewCampaign/constants';
import { convertEmulatorMessage } from 'pages/NewCampaign/utils';
import { FinalForm } from 'components/forms/FinalForm';
import { formatPrice } from 'utils/formatting';
import { useBaseChannelCalculatedInfo } from '../../../NewCampaign/ChannelsBriefsPages/hooks/use-base-channels-calculated-info';

const orderMessageFieldGetter = value => value && value.text;

function SmsOrderForm({ className, children }) {
  const { NewCampaign, Templates, WebsAndPhonesTaxons, Common } = useContext(StoresContext);
  let values = NewCampaign.currentCampaign.currentOrder;
  const { UserInfo } = useContext(StoresContext);
  const {
    minBudget,
    maxBudget,
  } = useBaseChannelCalculatedInfo(NewCampaign.currentCampaign.channel_uid);

  if (UserInfo?.data?.company?.inn && UserInfo?.data?.company?.self_employed === true) {
    values = {
      ...values,
      [ORDER_SENDER_NAME_FIELD]: 'BrandInfo',
    };
  }

  const dateValidators = useSmsDatesValidators();
  const { onlineGeo } = Templates.getNewCampaignTemplate('BriefOrderSms').form_order;
  const {
    [ORDER_MESSAGE_FIELD]: message,
    [USE_ONLINE_GEO]: use_online_geo,
  } = values;
  const emulatorText = useMemo(() => convertEmulatorMessage(message) || '', [message]);
  const minBudgetFormatted = formatPrice(minBudget);
  const maxBudgetFormatted = formatPrice(maxBudget);
  const getValidators = () => ({
    ...WebsAndPhonesTaxons.webSitesOnOfLine === 'online' ? {
      [ORDER_START_DATE_FIELD]: [composeRequiredValidator('Дата старта — обязательное поле')],
    } : {
      [ORDER_DATE]: [
        composeDateRequiredValidator(['Дата старта — обязательное поле', 'Дата завершения — обязательное поле']),
        composeStartDateValidator('Выберите доступную дату старта из календаря', dateValidators.countMinStartDate()),
      ],
    },
    ...NewCampaign.shouldPayForName ?
      {
        [ORDER_BUDGET_FIELD]: [
          composeNumberValidator(`Допустимые значения от ${formatPrice(minBudget)} ₽ до ${maxBudgetFormatted} ₽`, {
            min: minBudget,
            max: maxBudget,
          }),
        ],
      } : {
        [ORDER_BUDGET_FIELD]: [
          composeNumberValidator(`Допустимые значения от ${minBudgetFormatted} ₽ до ${maxBudgetFormatted} ₽`, {
            min: minBudget,
            max: maxBudget,
          }),
        ],
      },

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
  });

  return (
    <DateValidatorsContext.Provider value={dateValidators}>
      <FinalForm
        values={toJS(values)}
        className={className}
        onChange={action(data => {
          // отвечает за сброс онлайн гео при переключении на странице брифа
          if (!WebsAndPhonesTaxons.hasSegmentsStrategy) {
            if (data.use_online_geo === true) {
              NewCampaign.getOnlineGeoAudience(data.geo_points);
            } else if (data.use_online_geo === false) {
              data.geo_points = [];
              NewCampaign.getOnlineGeoAudience([]);
            }
          }
          NewCampaign.currentCampaign.currentOrder = data;
        })}
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
