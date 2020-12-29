import { createSelector } from 'reselect';
import {
  CHANNEL_STUB_INTERNET,
  CHANNEL_STUB_PUSH,
  CHANNEL_STUB_SMS,
  CHANNEL_STUB_TARGET_INTERNET,
  CHANNEL_STUB_VOICE,
} from 'constants/index';
import { getCommonCampaignChannelTypesById } from '../../campaign/selectors';
import { getTemplatesNewCampaign } from '../selectors';
import { deepTemplateTransformByContentType } from '../utils';

const getTemplateNewCampaignTransformed = createSelector(
  getTemplatesNewCampaign,
  deepTemplateTransformByContentType,
);

export const getBriefOrderSms = createSelector(
  getTemplateNewCampaignTransformed,
  data => data.BriefOrderSms || {},
);

export const getBriefOrderInternet = createSelector(
  getTemplateNewCampaignTransformed,
  data => data.BriefOrderInternet || {},
);

export const getBriefOrderVoice = createSelector(
  getTemplateNewCampaignTransformed,
  data => data.BriefOrderVoice || {},
);

export const getBriefOrderPush = createSelector(
  getTemplateNewCampaignTransformed,
  data => data.BriefOrderPush || {},
);

export const getBriefOrderTargetInternet = createSelector(
  getTemplateNewCampaignTransformed,
  data => data.BriefOrderTargetInternet || {},
);

export const getCampaignBriefsMap = createSelector(
  getCommonCampaignChannelTypesById,
  getBriefOrderSms,
  getBriefOrderInternet,
  getBriefOrderVoice,
  getBriefOrderPush,
  getBriefOrderTargetInternet,
  (channelTypesMap, sms, internet, voice, push, targetInternet) => ({
    [CHANNEL_STUB_SMS]: { title: channelTypesMap[CHANNEL_STUB_SMS]?.name, ...sms },
    [CHANNEL_STUB_INTERNET]: { title: channelTypesMap[CHANNEL_STUB_INTERNET]?.name, ...internet },
    [CHANNEL_STUB_VOICE]: { title: channelTypesMap[CHANNEL_STUB_VOICE]?.name, ...voice },
    [CHANNEL_STUB_PUSH]: { title: channelTypesMap[CHANNEL_STUB_PUSH]?.name, ...push },
    [CHANNEL_STUB_TARGET_INTERNET]: { title: channelTypesMap[CHANNEL_STUB_TARGET_INTERNET]?.name, ...targetInternet },
  }),
);

export const getSmsBriefFormOrder = createSelector(
  getBriefOrderSms,
  data => data.form_order,
);
export const getInternetBriefFormOrder = createSelector(
  getBriefOrderInternet,
  data => data.form_order,
);

export const getInternetBriefFormOrderTotal = createSelector(
  getInternetBriefFormOrder,
  data => data.total,
);

export const getInternetFormOrderEventsName = createSelector(
  getBriefOrderInternet,
  data => data.eventsNamesByCount,
);

export const getPushBriefFormOrder = createSelector(
  getBriefOrderPush,
  data => data.form_order,
);
export const getVoiceBriefFormOrder = createSelector(
  getBriefOrderVoice,
  data => data.form_order,
);

export const getTargetInternetBriefFormOrder = createSelector(
  getBriefOrderTargetInternet,
  data => data.form_order,
);

export const getTemplateBriefById = channelType => state => getCampaignBriefsMap(state)[channelType];
export const getTemplateBriefOrderFormById = channelType => state =>
  getTemplateBriefById(channelType)(state)?.form_order;

export const getBriefOrderFormBudget = formData => formData?.budget;
export const getBriefTitle = data => data?.title;
export const getBriefMainTipsDescription = data => data?.mainTipsDescription;
export const getBudgetDescription = data => data?.budgetDescription;
export const getBudgetErrorDescription = data => data?.budgetErrorDescription;
export const getBudgetEventsName = data => data?.eventsNamesByCount || ['', '', ''];
export const getBudgetEventsFromPrefix = data => data?.budgetEventsFromPrefix;
export const getBudgetEventsToPrefix = data => data?.budgetEventsToPrefix;
export const getBudgetFixButtonText = data => data?.budgetFixButtonText;

export const getBriefQuestionModal = template => template.QuestionModal;
export const getQuestionModalTitle = modalData => modalData?.title;
export const getQuestionModalDescription = modalData => modalData?.description;
export const getQuestionModalDeclineButton = modalData => modalData?.declineButtonText;
export const getQuestionModalConfirmButton = modalData => modalData?.confirmButtonText;
export const getQuestionFieldPlaceholder = modalData => modalData?.questionFieldPlaceholder;
export const getQuestionEmptyValidationText = modalData => modalData?.emptyValidationText;

export const getQuestionModalErrorImageSrc = modalData => modalData?.errorImageSrc;
export const getQuestionModalErrorTitle = modalData => modalData?.errorTitle;
export const getQuestionModalErrorDescription = modalData => modalData?.errorDescription;
export const getQuestionModalErrorButtonText = modalData => modalData?.errorButtonText;

export const getQuestionModalSuccessImageSrc = modalData => modalData?.successImageSrc;
export const getQuestionModalSuccessTitle = modalData => modalData?.successTitle;
export const getQuestionModalSuccessDescription = modalData => modalData?.successDescription;
export const getQuestionModalSuccessButtonText = modalData => modalData?.successButtonText;
