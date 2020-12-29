import NewCampaign from 'store/mobx/NewCampaign';
import Common from 'store/mobx/Common';
import WebsAndPhonesTaxons from 'store/mobx/WebsAndPhonesTaxons';
import { isNullOrUndefined, wordFormByCount, wordGenitiveFormByCount } from 'utils/fn';
import {
  CHANNEL_STUB_INTERNET,
  CHANNEL_STUB_PUSH,
  CHANNEL_STUB_TARGET_INTERNET,
  CHANNEL_STUB_VOICE,
  CHANNEL_STUB_SMS,
} from 'constants/index';

const getEventNameByProps = ({ eventForms, minEvents, maxEvents, avgEvents }) => {
  if (avgEvents) return wordFormByCount(Math.floor(avgEvents), eventForms);
  return wordGenitiveFormByCount(Math.floor(maxEvents || minEvents), [eventForms[1], eventForms[2]]);
};

export const useBaseChannelCalculatedInfo = () => {
  const orderFormData = NewCampaign.currentCampaign.currentOrder;
  const eventForms = ['клик', 'клика', 'кликов'];
  const eventFormMesages = ['сообщение', 'сообщения', 'сообщений'];
  const getEventByUid = {
    [CHANNEL_STUB_SMS]: eventFormMesages,
    [CHANNEL_STUB_PUSH]: eventFormMesages,
    [CHANNEL_STUB_VOICE]: eventForms,
    [CHANNEL_STUB_INTERNET]: eventForms,
    [CHANNEL_STUB_TARGET_INTERNET]: eventForms,
  };
  const selectionCount = isNullOrUndefined(NewCampaign.currentCampaign?.currentOrder?.data?.msisdns_count) ? NewCampaign?.currentCampaign?.audience : NewCampaign.currentCampaign?.currentOrder?.data?.msisdns_count;
  let minBudget;
  let maxBudget = 0;
  if (
    NewCampaign.currentCampaign.currentOrder.channel_uid === CHANNEL_STUB_SMS &&
    NewCampaign.currentCampaign.currentOrder.external_operator === true
  ) {
    minBudget = NewCampaign.shouldPayForName ? Common.constants.EXTERNAL_OPERATOR_NAME_SENDER_BUDGET + Common.constants.EXTERNAL_OPERATOR_MIN_BUDGET : Common.constants.EXTERNAL_OPERATOR_MIN_BUDGET;
  } else {
    minBudget = NewCampaign.currentCampaign.currentOrder.minimalBudget;
  }

  if (NewCampaign.currentCampaign.currentOrder.channel_uid === CHANNEL_STUB_SMS) {
    maxBudget = Common.constants.MAX_SMS_BUDGET;
  }

  const { budget, minQty, maxQty } = orderFormData;
  const { qty, event_cost } = NewCampaign.calculate;

  const isBudgetValid = typeof budget !== 'number' ? true : budget >= minBudget;

  const maxEvents = isBudgetValid ? maxQty : 0;
  const minEvents = isBudgetValid ? minQty : 0;
  let avgEvents;
  if (NewCampaign.currentCampaign.currentOrder.channel_uid === CHANNEL_STUB_SMS) {
    avgEvents = qty;
  } else {
    avgEvents = isBudgetValid ? qty : 0;
  }

  const isAudienceSmall = () => {
    // если есть кастомные сегменты и аудитория загружается
    if (
      NewCampaign.isWebSitesCalculating &&
      WebsAndPhonesTaxons.hasSegmentsStrategy
    ) return false;
    // Если есть кастомные сегменты и аудитория будет загружена через сутки или по факту
    if (
      !NewCampaign.isWebSitesCalculating &&
      WebsAndPhonesTaxons.hasSegmentsStrategy &&
      NewCampaign.currentCampaign?.currentOrder?.data?.msisdns_count === undefined
    ) return false;
    return selectionCount < maxEvents || selectionCount < avgEvents;
  };


  const eventsName = getEventNameByProps({ eventForms: getEventByUid[NewCampaign.currentCampaign.channel_uid], minEvents, maxEvents, avgEvents });
  const eventsExternalName = getEventNameByProps({ eventForms: getEventByUid[NewCampaign.currentCampaign.channel_uid], avgEvents: NewCampaign.calculate.external_operator_qty });
  return {
    minBudget,
    minEvents,
    maxEvents,
    avgEvents,
    isAudienceSmall: isAudienceSmall(),
    isBudgetValid,
    eventsName,
    event_cost,
    maxBudget,
    eventsExternalName,
    budgetToDto: (budget || minBudget) || 0,
  };
};
