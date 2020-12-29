import { createSelector } from 'reselect';
import { convertListToObjectBy, isNullOrUndefined, filter } from 'utils/fn';
import { connectNested, createContextSelector, createReduceSelector } from 'utils/redux';
import {
  getMaxToolsBudget,
  getMinToolsBudget,
} from 'store/common/commonConstants/selector';
import { CHANNEL_STUB_INTERNET, CHANNEL_STUB_PUSH, CHANNEL_STUB_SMS, CHANNEL_STUB_VOICE } from 'constants/index';
import {
  getPushChannelTypesData,
  getSmsChannelTypesData,
  getVoiceChannelTypesData,
} from 'store/common/campaign/selectors';
import { getActiveChannelIds, getNewCampaignOrdersData } from 'store/NewCampaign/storage/selectors';
import { getNewCampaignChannels } from 'store/MyCampaigns/selectors';
import { getDictionariesTools } from 'store/NewCampaign/dictionaries/selectors';
import { createDeepEqualSelector } from 'store/utils';
import { EMPTY_ARRAY, EMPTY_OBJECT } from 'store/constants';
import {
  ORDER_BUDGET_FIELD,
  ORDER_SENDING_FIELD,
  ORDER_TOOLS_FIELD,
  MIN_SELECTED_INTERNET_INSTRUMENTS,
  ORDER_CONNECTION_TYPE,
  WAY_TO_MAKE_CALL,
  ACTIVITY_FIELD,
} from './constants';
import { ChannelContext } from './context';

export const getSelectedChannelsList = createSelector(
  getNewCampaignChannels,
  getActiveChannelIds,
  (list, activeOrderIds) => list.filter(item => activeOrderIds.indexOf(item.channel_uid) !== -1),
);

export const getSubStepsFromChannels = createSelector(
  getSelectedChannelsList,
  list =>
    list.map(({ channel_uid: channelUid, name, nameTemplate }) => ({
      slug: channelUid,
      title: nameTemplate || name,
      isSubStep: true,
    })),
);

export const getChannelData = createContextSelector(ChannelContext)(
  getNewCampaignChannels,
  convertListToObjectBy('channel_uid'),
);

export const connect = (...args) => connectNested([ChannelContext], ...args);

export const pickActiveBudgetByChannelAndOrder = (order, channel) =>
  order.isActive ? order[ORDER_BUDGET_FIELD] || channel.minimal_budget : 0;

export const checkValidIsSelectedToolsCount = (tools) => {
  const selectedInstrumentsCount = (tools || []).reduce((acc, tool) => (tool.isActive ? acc + 1 : acc), 0);
  return selectedInstrumentsCount >= MIN_SELECTED_INTERNET_INSTRUMENTS;
};

export const checkValidToCalculateInternet = (formData, channelTypeData) => {
  if (!formData.industry) return false;

  if (!checkValidIsSelectedToolsCount(formData.tools)) {
    return false;
  }

  const totalToolsBudget = (formData?.tools || []).reduce((acc, tool) => {
    if (tool.isActive) {
      return acc + tool.budget;
    }
    return acc;
  }, 0);

  return totalToolsBudget >= channelTypeData.minimal_budget;
};

export const getSubHeadline = createReduceSelector(getChannelData, item => item.subHeadlineTemplate);
export const getMinBudget = createReduceSelector(getChannelData, item => item.minimal_budget);

export const getSmsOrderFormRawData = createSelector(
  getNewCampaignOrdersData,
  forms => forms[CHANNEL_STUB_SMS] || EMPTY_OBJECT,
);

export const getInternetOrderFormRawData = createSelector(
  getNewCampaignOrdersData,
  forms => forms[CHANNEL_STUB_INTERNET] || EMPTY_OBJECT,
);

export const getPushOrderFormRawData = createSelector(
  getNewCampaignOrdersData,
  forms => forms[CHANNEL_STUB_PUSH] || EMPTY_OBJECT,
);

export const getVoiceOrderFormRawData = createSelector(
  getNewCampaignOrdersData,
  forms => forms[CHANNEL_STUB_VOICE] || EMPTY_OBJECT,
);

export const getDefaultInternetOrderToolsItem = createSelector(
  getMinToolsBudget,
  getMaxToolsBudget,
  (minToolsBudget, maxToolsBudget) => ({
    isActive: false,
    budget: minToolsBudget,
    min: minToolsBudget,
    max: maxToolsBudget,
  }),
);

const getOrderTools = createSelector(
  getInternetOrderFormRawData,
  data => data[ORDER_TOOLS_FIELD] || EMPTY_ARRAY,
);

export const getMergedOrderTools = createDeepEqualSelector(
  getOrderTools,
  getDictionariesTools,
  getDefaultInternetOrderToolsItem,
  (orderTools, toolsList, defaultItem) =>
    toolsList.map(value => ({
      ...defaultItem,
      ...(orderTools.find(val => val.id === value.id) || {}),
      ...value,
    })),
);

export const getInternetOrderFormValues = createSelector(
  getInternetOrderFormRawData,
  getMergedOrderTools,
  (formValues, orderTools) => ({
    ...formValues,
    [ORDER_TOOLS_FIELD]: orderTools,
  }),
);

const getBudgetValueByMinimal = (fieldValue, minimalBudget) => {
  if (isNullOrUndefined(fieldValue)) return minimalBudget;
  return fieldValue;
};

export const getSmsOrderFormValues = createSelector(
  getSmsOrderFormRawData,
  getSmsChannelTypesData,
  (formValues, { minimal_budget: minimalBudget }) => ({
    ...formValues,
    [ORDER_BUDGET_FIELD]: getBudgetValueByMinimal(formValues[ORDER_BUDGET_FIELD], minimalBudget),
    [ORDER_SENDING_FIELD]: formValues[ORDER_SENDING_FIELD] || [9, 21],
  }),
);

export const getPushOrderFormValues = createSelector(
  getPushOrderFormRawData,
  getPushChannelTypesData,
  (formValues, { minimal_budget: minimalBudget }) => ({
    ...formValues,
    [ORDER_BUDGET_FIELD]: getBudgetValueByMinimal(formValues[ORDER_BUDGET_FIELD], minimalBudget),
    [ORDER_SENDING_FIELD]: formValues[ORDER_SENDING_FIELD] || [9, 21],
  }),
);

export const getVoiceOrderFormValues = createSelector(
  getVoiceOrderFormRawData,
  getVoiceChannelTypesData,
  (formValues, VoiceChannelTypesData) => {
    const { minimal_budget: minimalBudget } = VoiceChannelTypesData;
    const cleanFormValues = filter(formValues, (item) => item);

    return {
      [ORDER_CONNECTION_TYPE]: 1,
      [WAY_TO_MAKE_CALL]: 1,
      [ACTIVITY_FIELD]: {},
      ...cleanFormValues,
      [ORDER_BUDGET_FIELD]: getBudgetValueByMinimal(formValues[ORDER_BUDGET_FIELD], minimalBudget),
    };
  },
);
