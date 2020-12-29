import { EMPTY_OBJECT } from '../constants';

export function getDashboardTemplate(componentName) {
  try {
    return this.data?.dashboard[componentName] || EMPTY_OBJECT;
  } catch (e) {
    console.log(e);
    return {};
  }
}

export function getNewCampaignTemplate(componentName) {
  try {
    return this.data?.newCampaign[componentName] || EMPTY_OBJECT;
  } catch (e) {
    return {};
  }
}

export function getChatTemplate(componentName) {
  return this.data?.chat[componentName] || {};
}

export function getPopupsTemplate(popupName) {
  try {
    return this.data.popups[popupName] || EMPTY_OBJECT;
  } catch (e) {
    return {};
  }
}

export function getPollsTemplate(name) {
  try {
    return this.data.polls[name] || EMPTY_OBJECT;
  } catch (e) {
    return {};
  }
}

export function getCommonTemplate(name) {
  try {
    return this.data.common[name] || EMPTY_OBJECT;
  } catch (e) {
    return {};
  }
}

export function getAudienceStatisticTemplate(template) {
  try {
    return this.data.audienceStatistic[template] || EMPTY_OBJECT;
  } catch (e) {
    return {};
  }
}

export function getUserInfoData() {
  try {
    return this.data;
  } catch (e) {
    return {};
  }
}

export function getUserInfoCompany() {
  return this.data?.company || {};
}

export function getWebinarSubscribe(name, init = '') {
  if (!this.data.dashboard.WebinarSubscribe[name]) return init;
  return this.data.dashboard.WebinarSubscribe[name];
}

export function getConfirmInnTemplate(name) {
  if (!this?.data?.common?.ConfirmInn[name]) return '';
  return this.data.common.ConfirmInn[name];
}

export function getConfirmInnPrivateTemplate(name) {
  if (!this?.data?.common?.ConfirmInnPrivate[name]) return '';
  return this.data.common.ConfirmInnPrivate[name];
}

