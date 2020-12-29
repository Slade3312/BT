import {
  COMPANY_INDUSTRY,
  COMPANY_WEBSITE,
  FIRST_NAME,
  LAST_NAME,
  EMAIL,
  MIDDLE_NAME,
  PHONE,
  COMPANY_INN,
  COMPANY,
  COMPANY_SOCIAL_FACEBOOK,
  COMPANY_SOCIAL_VKONTAKTE,
  COMPANY_SOCIAL_INSTAGRAM,
} from 'store/common/userInfo/constants';

export const viewToDto = (data) => {
  const companyData = data[COMPANY] || {};
  return {
    [FIRST_NAME]: data[FIRST_NAME],
    [LAST_NAME]: data[LAST_NAME],
    [MIDDLE_NAME]: data[MIDDLE_NAME],
    [EMAIL]: data[EMAIL],
    [PHONE]: data[PHONE],
    [COMPANY]: {
      [COMPANY_INDUSTRY]: companyData[COMPANY_INDUSTRY],
      [COMPANY_INN]: companyData[COMPANY_INN],
      [COMPANY_WEBSITE]: companyData[COMPANY_WEBSITE],
      [COMPANY_SOCIAL_FACEBOOK]: companyData[COMPANY_SOCIAL_FACEBOOK],
      [COMPANY_SOCIAL_VKONTAKTE]: companyData[COMPANY_SOCIAL_VKONTAKTE],
      [COMPANY_SOCIAL_INSTAGRAM]: companyData[COMPANY_SOCIAL_INSTAGRAM],
    },
  };
};
