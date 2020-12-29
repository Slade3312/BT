import {
  EMAIL,
  FIRST_NAME,
  LAST_NAME,
  MIDDLE_NAME,
  USER_NAME,
  PHONE,
  COMPANY,
  COMPANY_INDUSTRY,
  COMPANY_WEBSITE,
  COMPANY_SOCIAL_FACEBOOK,
  COMPANY_SOCIAL_VKONTAKTE,
  COMPANY_SOCIAL_INSTAGRAM,
} from 'store/common/userInfo/constants';

export const USER_INFO_FORM = 'userInfo';

export const FIELD_FIRST_NAME = FIRST_NAME;
export const FIELD_LAST_NAME = LAST_NAME;
export const FIELD_MIDDLE_NAME = MIDDLE_NAME;
export const FIELD_USER_NAME = USER_NAME;
export const FIELD_PHONE = PHONE;
export const FIELD_EMAIL = EMAIL;
export const FIELD_COMPANY_INDUSTRY = `${COMPANY}.${COMPANY_INDUSTRY}`;
export const FIELD_COMPANY_WEBSITE = `${COMPANY}.${COMPANY_WEBSITE}`;
export const FIELD_COMPANY_SOCIAL_FACEBOOK = `${COMPANY}.${COMPANY_SOCIAL_FACEBOOK}`;
export const FIELD_COMPANY_SOCIAL_VKONTAKTE = `${COMPANY}.${COMPANY_SOCIAL_VKONTAKTE}`;
export const FIELD_COMPANY_SOCIAL_INSTAGRAM = `${COMPANY}.${COMPANY_SOCIAL_INSTAGRAM}`;
