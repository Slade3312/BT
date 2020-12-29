import { ADCREATINGFORM } from 'pages/NewCampaign/constants';

export const stepAdCreatingIndicators = {
  [ADCREATINGFORM.TITLE]: true,
  [ADCREATINGFORM.DESCRIPTION]: true,
  [ADCREATINGFORM.BUTTONTEXT]: true,
  [ADCREATINGFORM.TITLE]: true,
  [ADCREATINGFORM.WEBSITE]: true,
  [ADCREATINGFORM.FILES]: true,
  // move this field inside form to more convenience and right validation working
  logo: true,
  mainImg: true,
  filesCategories: true,
};

export const stepCompanyInfoIndicators = {
  [ADCREATINGFORM.CLIENT_INFO]: true,
  [ADCREATINGFORM.INDUSTRY]: true,
};

export const stepChosenTariffsFieldsIndicators = {
  [ADCREATINGFORM.AUTO_START]: true,
  [ADCREATINGFORM.DATE]: true,
  [ADCREATINGFORM.CHOSEN_TARIFF]: true,
};

export const TARGET_INTERNET_BRIEF_FORM_NAME = 'targetInternetBriefForm';
