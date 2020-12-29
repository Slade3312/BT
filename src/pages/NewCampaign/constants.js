import { convertMbToBytes } from 'utils/fn';

export const CAMPAIGN_STEP_FORM_ID = 'campaign-form';
export const INTERNET_ORDER_FORM_ID = 'internet-order-form';
export const VOICE_TARGET_ORDER_FORM_ID = 'voice-target-order-form';
export const SMS_ORDER_FORM_ID = 'sms-order-form';
export const PUSH_ORDER_FORM_ID = 'push-order-form';

// eslint-disable-next-line max-len
export const ABOUT_VOICE_TARGET_LINK =
  'https://static.beeline.ru/upload/images/business/doc/23939_sposoby_podcliucheniia_uslugi_Golosovoi_obzvon.pdf';

export const availableDate = '{availableDate}';

export const brandFileSizeMegabytes = 5;
export const brandFileSizeBytes = convertMbToBytes(brandFileSizeMegabytes);
export const TARIFF_CARDS_NODE_ID = 'tariffCards';

export const TITLE = 'title';

// TODO rename this to common SocialChannelForm
export const ADCREATINGFORM = {
  TITLE: 'title',
  DESCRIPTION: 'text',
  BUTTONTEXT: 'button',
  WEBSITE: 'url',
  UTM: 'utm',
  MOBILE: 'mobile',
  DESKTOP: 'desktop',
  CHOSEN_TARIFF: 'chosenTariff',
  DATE: 'date',
  AUTO_START: 'auto_start',
  CLIENT_INFO: 'client_info',
  INDUSTRY: 'industry',
  CREATIVES: 'creatives',
  INDUSTRY_DOCS: 'industry_docs',
  FILES: 'files',
};

export const MAX_CHARS_TITLE = 25;
export const MAX_CHARS_DESCRIPTION = 90;

export const WEB_SITES_ON_OF_LINE = 'webSitesOnOfLine';
