import {
  AUDIENCE_STATISTIC_REPORT_URL,
  AUDIENCE_STATISTIC_URL,
  DASHBOARD_URL,
  FAQ_URL,
  MY_CAMPAIGNS_URL,
  NEW_CAMPAIGN_URL,
  USER_INFO_URL,
} from 'pages/constants';

export const getLocationNameByUrl = (pathUrl) => {
  if (pathUrl.includes(DASHBOARD_URL)) return 'Главная страница';
  if (pathUrl.includes(NEW_CAMPAIGN_URL)) return 'Создать кампанию';
  if (pathUrl.includes(MY_CAMPAIGNS_URL)) return 'Мои кампании';
  if (pathUrl.includes(USER_INFO_URL)) return 'Профиль';
  if (pathUrl.includes(AUDIENCE_STATISTIC_REPORT_URL)) return 'Анализ аудитории/Отчёт';
  if (pathUrl.includes(AUDIENCE_STATISTIC_URL)) return 'Анализ аудитории';
  if (pathUrl.includes(FAQ_URL)) return 'Помощь';
  return 'Unknown page';
};

export const getClientTemplates = (userInfoFieldSpecs) => {
  const getLabel = fieldName => userInfoFieldSpecs[fieldName]?.label;
  const getPlaceholder = fieldName => userInfoFieldSpecs[fieldName]?.placeholder;

  return [getLabel, getPlaceholder];
};

