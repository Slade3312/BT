import {
  getPushChannelTypesData,
  getSmsChannelTypesData,
  getVoiceChannelTypesData,
} from 'store/common/campaign/selectors';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';

import {
  GEO_POINTS,
  ORDER_ADD_INFO_FIELD,
  ORDER_BUDGET_FIELD,
  ORDER_CHOSEN_TARIFF,
  ORDER_COMMENT_FIELD,
  ORDER_CONNECTION_TYPE,
  ORDER_DATE,
  ORDER_FILES_FIELD,
  ORDER_FINISH_DATE_FIELD,
  ORDER_INDUSTRY_FIELD,
  ORDER_LINKS_FIELD,
  ORDER_MESSAGE_FIELD,
  ORDER_MOBILE_VERSION,
  ORDER_SENDER_NAME_FIELD,
  ORDER_SENDING_FIELD,
  ORDER_SERVICES_FIELD,
  ORDER_START_DATE_FIELD,
  ORDER_TARGET_ACTION,
  ORDER_TEST_NUMBERS_FIELD,
  ORDER_TOOLS_FIELD,
  ORDER_URL_ADVERTISER_FIELD,
  USE_ONLINE_GEO,
  WAY_TO_MAKE_CALL,
  ACTIVITY_FIELD,
} from '../channels/constants';
import { viewToDtoInternetOrderTools } from './utils';

export const formatTestPhoneNumbers = testPhoneNumbersList =>
  testPhoneNumbersList?.length > 0 ? testPhoneNumbersList.join(',') : undefined;

const formatFiles = files => (files && files.map ? files.map(item => item.id) : undefined);

const getBudgetByChannelData = (budget, minimalBudget) => parseFloat(budget) || minimalBudget;

export const viewToDtoVoiceChannel = (formValues, state) => {
  const callsData = {
    [ORDER_CONNECTION_TYPE]: formValues[ORDER_CONNECTION_TYPE],
  };
  if (formValues[ORDER_CONNECTION_TYPE] === 1) {
    callsData[WAY_TO_MAKE_CALL] = formValues[WAY_TO_MAKE_CALL];
  }
  if (formValues[ORDER_CONNECTION_TYPE] === 2) {
    callsData[ACTIVITY_FIELD] = formValues[ACTIVITY_FIELD].id;
  }

  return {
    [ORDER_BUDGET_FIELD]: getBudgetByChannelData(formValues[ORDER_BUDGET_FIELD], getVoiceChannelTypesData(state).minimal_budget),
    [ORDER_START_DATE_FIELD]: formValues[ORDER_DATE] && formValues[ORDER_DATE][0],
    [ORDER_FINISH_DATE_FIELD]: formValues[ORDER_DATE] && formValues[ORDER_DATE][1],
    data: {
      [ORDER_COMMENT_FIELD]: formValues[ORDER_COMMENT_FIELD],
      ...callsData,
    },
  };
};

export const viewToDtoSmsChannel = (formValues, state, customProps) => ({
  [ORDER_BUDGET_FIELD]: getBudgetByChannelData(formValues[ORDER_BUDGET_FIELD], getSmsChannelTypesData(state).minimal_budget),
  [ORDER_START_DATE_FIELD]: formValues[ORDER_DATE] && formValues[ORDER_DATE][0],
  [ORDER_FINISH_DATE_FIELD]: formValues[ORDER_DATE] && formValues[ORDER_DATE][1],
  [ORDER_FILES_FIELD]: formatFiles(formValues[ORDER_FILES_FIELD]),
  [ORDER_LINKS_FIELD]: formValues[ORDER_MESSAGE_FIELD]?.links.map(item => {
    return {
      ...item,
      shortLink: item.isShort && item.shortLink || 'none',
    };
  }) || [],
  data: {
    [ORDER_MESSAGE_FIELD]: formValues[ORDER_MESSAGE_FIELD]?.text,
    [ORDER_TEST_NUMBERS_FIELD]: formatTestPhoneNumbers(formValues[ORDER_TEST_NUMBERS_FIELD]),
    [ORDER_SENDING_FIELD]: formValues[ORDER_SENDING_FIELD],
    [ORDER_SERVICES_FIELD]: formValues[ORDER_SERVICES_FIELD],
    [ORDER_SENDER_NAME_FIELD]: formValues[ORDER_SENDER_NAME_FIELD],
    [USE_ONLINE_GEO]: formValues[USE_ONLINE_GEO],
    shortText: customProps.emulatorText,
    [GEO_POINTS]: formValues[USE_ONLINE_GEO] ? formValues[GEO_POINTS] : undefined,
  },
});

export const viewToDtoPushChannel = (formValues, state) => ({
  [ORDER_BUDGET_FIELD]: getBudgetByChannelData(formValues[ORDER_BUDGET_FIELD], getPushChannelTypesData(state).minimal_budget),
  [ORDER_START_DATE_FIELD]: formValues[ORDER_DATE] && formValues[ORDER_DATE][0],
  [ORDER_FINISH_DATE_FIELD]: formValues[ORDER_DATE] && formValues[ORDER_DATE][1],
  data: {
    [ORDER_TEST_NUMBERS_FIELD]: formatTestPhoneNumbers(formValues[ORDER_TEST_NUMBERS_FIELD]),
    [ORDER_SENDING_FIELD]: formValues[ORDER_SENDING_FIELD],
    [ORDER_TARGET_ACTION]: formValues[ORDER_TARGET_ACTION],
    [ORDER_URL_ADVERTISER_FIELD]: formValues[ORDER_URL_ADVERTISER_FIELD],
    [ORDER_MESSAGE_FIELD]: formValues[ORDER_MESSAGE_FIELD],
    [ORDER_SERVICES_FIELD]: formValues[ORDER_SERVICES_FIELD],
  },
});

export const viewToDtoInternetChannel = formValues => ({
  [ORDER_START_DATE_FIELD]: formValues[ORDER_DATE] && formValues[ORDER_DATE][0],
  [ORDER_FINISH_DATE_FIELD]: formValues[ORDER_DATE] && formValues[ORDER_DATE][1],
  data: {
    [ORDER_TOOLS_FIELD]: viewToDtoInternetOrderTools(formValues[ORDER_TOOLS_FIELD]),
    [ORDER_CHOSEN_TARIFF]: formValues[ORDER_CHOSEN_TARIFF],
    [ORDER_INDUSTRY_FIELD]: formValues[ORDER_INDUSTRY_FIELD],
    [ORDER_URL_ADVERTISER_FIELD]: formValues[ORDER_URL_ADVERTISER_FIELD],
    [ORDER_ADD_INFO_FIELD]: formValues[ORDER_ADD_INFO_FIELD],
    [ORDER_MOBILE_VERSION]: formValues[ORDER_MOBILE_VERSION],
  },
});

export const getTargetInternetDateFields = (formValues) => {
  if (formValues.auto_start) {
    return {};
  }
  return {
    [ORDER_START_DATE_FIELD]: formValues[ORDER_DATE] && formValues[ORDER_DATE][0],
    [ORDER_FINISH_DATE_FIELD]: formValues[ORDER_DATE] && formValues[ORDER_DATE][1],
  };
};

export const viewToDtoTargetInternetChannel = formValues => ({
  ...getTargetInternetDateFields(formValues),
  files: [
    formValues[ADCREATINGFORM.FILES][0].id,
    formValues[ADCREATINGFORM.FILES][1].id,
    formValues[ADCREATINGFORM.FILES][2].id,
  ],
  [ADCREATINGFORM.INDUSTRY_DOCS]: formValues[ADCREATINGFORM.INDUSTRY_DOCS].map(fileObj => fileObj.id),
  data: {
    [ADCREATINGFORM.TITLE]: formValues[ADCREATINGFORM.TITLE],
    [ADCREATINGFORM.DESCRIPTION]: formValues[ADCREATINGFORM.DESCRIPTION],
    [ADCREATINGFORM.BUTTONTEXT]: formValues[ADCREATINGFORM.BUTTONTEXT],
    [ADCREATINGFORM.WEBSITE]: formValues[ADCREATINGFORM.WEBSITE],
    [ADCREATINGFORM.UTM]: formValues[ADCREATINGFORM.UTM],
    [ADCREATINGFORM.MOBILE]: formValues[ADCREATINGFORM.MOBILE],
    [ADCREATINGFORM.DESKTOP]: formValues[ADCREATINGFORM.DESKTOP],
    [ADCREATINGFORM.CHOSEN_TARIFF]: formValues[ADCREATINGFORM.CHOSEN_TARIFF],
    [ADCREATINGFORM.AUTO_START]: formValues[ADCREATINGFORM.AUTO_START],
    [ADCREATINGFORM.INDUSTRY]: formValues[ADCREATINGFORM.INDUSTRY],
    [ADCREATINGFORM.CLIENT_INFO]: formValues[ADCREATINGFORM.CLIENT_INFO],
    [ADCREATINGFORM.CREATIVES]: [
      formValues[ADCREATINGFORM.FILES][0].id,
      formValues[ADCREATINGFORM.FILES][1].id,
      formValues[ADCREATINGFORM.FILES][2].id,
    ],
  },
});

export const viewToDtoInternetChannelForMediaplans = ({ [ORDER_CHOSEN_TARIFF]: _, ...otherValues }) =>
  viewToDtoInternetChannel(otherValues);
