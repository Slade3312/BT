import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { observer } from 'mobx-react';
import { useDispatch } from 'react-redux';
import { StoresContext } from 'store/mobx';
import { FinalForm } from 'components/forms';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';
import {
  composeDateRequiredValidator,
  composeRequiredValidator,
  composeStartDateValidator,
  composeUrlValidator,
  composeDenyEntriesFromArray,
  composeCreativesValidator,
  composeHttpValidator,
  composeFirstLetterUppercase,
  composeLastLetterNotDot,
  composeCheckIfNotHTML,
  composeCheckIfNotEmailSymbol,
  composeChekIfContainPhoneNumber,
  composeExlamationPointLimit,
  composeLengthValidator,
} from 'utils/fieldValidators';
import { ORDER_DATE } from 'store/NewCampaign/channels/constants';
import useSocialDatesValidators from 'pages/NewCampaign/ChannelsBriefsPages/hooks/useTargetInternetDatesValidators';
import { TARGET_INTERNET_BRIEF_FORM_NAME } from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/constants';
import FormController from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/containers/FormController';
import { addDays } from 'utils/date';
import { syncOrderDataAndEvents } from 'store/NewCampaign/storage/actions/sync';
import { CHANNEL_STUB_TARGET_INTERNET } from 'constants/index';

const formatDate = (date) => {
  return moment(date).format('YYYY-MM-DD');
};

const AdCreatingForm = ({ children, className }) => {
  const dispatch = useDispatch();
  const { Social, Templates } = useContext(StoresContext);
  const { deniedSocials } = Templates.getNewCampaignTemplate('BriefOrderTargetInternet');
  const dateValidators = useSocialDatesValidators();
  const industryDocsValidate = Social.activeCompanyIndustry.industry_docs?.length || false;

  const composeIndustryDocsValidator = (message, validateLength) => (value) => {
    if (value.length && validateLength === value.length) return undefined;
    return message;
  };

  const currentTariff = useRef(1);

  const getValidators = () => ({
    ...!Social.adStep[ADCREATINGFORM.AUTO_START] ? { [ORDER_DATE]: [
      composeDateRequiredValidator(['Дата старта — обязательное поле', 'Дата завершения — обязательное поле']),
      composeStartDateValidator('Выберите доступную дату старта из календаря', dateValidators.countMinStartDate()),
    ] } : {},
    [ADCREATINGFORM.TITLE]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
      composeFirstLetterUppercase('Заголовок должен начинаться с заглавной буквы'),
      composeLastLetterNotDot('Заголовок не может заканчиваться точкой'),
    ],
    [ADCREATINGFORM.DESCRIPTION]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
      composeCheckIfNotHTML('В описании не может быть HTML кода'),
      composeCheckIfNotEmailSymbol('Запрещено указывать email или системы онлайн-пейджинга'),
      composeFirstLetterUppercase('Описание должно начинаться с заглавной буквы'),
      composeChekIfContainPhoneNumber('Запрещено указывать телефонные номера в описании'),
      composeExlamationPointLimit('Запрещено использование больше двух восклицательных знаков'),
    ],
    [ADCREATINGFORM.BUTTONTEXT]: [composeRequiredValidator('Поле обязательное для заполнения')],
    [ADCREATINGFORM.FILES]: [composeCreativesValidator()],
    [ADCREATINGFORM.WEBSITE]: [
      composeRequiredValidator('Поле обязательное для заполнения'),
      composeUrlValidator('Строка не является валидным веб-адресом'),
      composeHttpValidator('Адрес должен начинаться с http:// или https://'),
      composeLengthValidator('Длина урл должна быть не более 200 символов', { max: 200 }),
      composeDenyEntriesFromArray('Вы ввели недопустимый адрес веб-сайта', deniedSocials),
    ],
    [ADCREATINGFORM.CLIENT_INFO]: [composeRequiredValidator('Поле обязательное для заполнения')],
    [ADCREATINGFORM.INDUSTRY]: [composeRequiredValidator('Поле обязательное для заполнения')],
    [ADCREATINGFORM.INDUSTRY_DOCS]: industryDocsValidate
      ? [composeIndustryDocsValidator('Все документы обязательны для предоставления', industryDocsValidate)] : [],
  });

  return (
    <FinalForm
      className={className}
      id={TARGET_INTERNET_BRIEF_FORM_NAME}
      getValidators={getValidators}
      values={Social.adStep}
      onChange={(values) => {
        Social.set('showErrors', false);
        const updatedValues = values;
        if (values.date && values.chosenTariff && values.chosenTariff !== currentTariff.current) {
          updatedValues.date[1] = addDays(
            new Date(values.date[0]),
            Social.getTariffDurationById(values.chosenTariff),
          );
          updatedValues.date[1] = formatDate(updatedValues.date[1]);
        }
        Social.set('adStep', updatedValues);
        currentTariff.current = values.chosenTariff;

        dispatch(syncOrderDataAndEvents(CHANNEL_STUB_TARGET_INTERNET, updatedValues));
      }}
    >
      <FormController>
        {props => {
          if (typeof children === 'function') {
            return children(props);
          }
          return children;
        }}
      </FormController>
    </FinalForm>
  );
};

AdCreatingForm.propTypes = {
  children: PropTypes.any,
  className: PropTypes.string,
};

export default observer(AdCreatingForm);
