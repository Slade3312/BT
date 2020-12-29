import { useSelector } from 'react-redux';
import { useFormState } from 'react-final-form';
import { getSelectionCount } from 'store/NewCampaign/controls/selectors';
import { wordFormByCount } from 'utils/fn';
import { CHANNEL_STUB_VOICE } from 'constants/index';
import {
  getBudgetEventsName,
  getCampaignBriefsMap,
} from 'store/common/templates/newCampaign/briefs-selectors';
import { ACTIVITY_FIELD, ORDER_CONNECTION_TYPE } from 'store/NewCampaign/channels/constants';
import { getChannelsData } from 'store/MyCampaigns/selectors';
import { getConstantsVariables } from 'store/common/commonConstants/selector';
import { getVoiceOrderFormValues } from 'store/NewCampaign/channels/selectors';
import { customersFormByCount } from 'utils/date';
import { useGetCampaignOrderForms } from 'pages/NewCampaign/hooks/use-get-campaign-order-forms';

export const useVoiceChannelCalculatedInfo = () => {
  let { connectionTypes } = useSelector(getChannelsData);
  connectionTypes = connectionTypes.map((item) => {
    return {
      ...item,
      value: item.id,
    };
  });

  const orderFormData = useGetCampaignOrderForms()[CHANNEL_STUB_VOICE] || {};
  const { budget } = useSelector(getVoiceOrderFormValues);
  const currentBrief = useSelector(getCampaignBriefsMap)[CHANNEL_STUB_VOICE];
  const selectionCount = useSelector(getSelectionCount);
  const eventForms = getBudgetEventsName(currentBrief);
  const { activityFields } = useSelector(getChannelsData);
  const { VOICE_CPA_CONNECTION_TAB_1_BUDGET, VOICE_CPA_CONNECTION_TAB_2_BUDGET, VOICE_CPA_CONNECTION_TAB_3_BUDGET } = useSelector(getConstantsVariables);
  const { minQty, maxQty, eventsCost, isActive } = orderFormData;

  connectionTypes[0].price = eventsCost;

  const contactCenterMinimalPrice = activityFields.reduce((acc, cur) => {
    for (let i = 0; i < cur.children.length; i += 1) {
      if (cur.children[i].cost < acc) {
        acc = cur.children[i].cost;
      }
    }

    return acc;
  }, Number.MAX_VALUE);

  connectionTypes[1].price = contactCenterMinimalPrice;
  connectionTypes[2].price = VOICE_CPA_CONNECTION_TAB_3_BUDGET;

  const { values } = useFormState();
  const {
    [ORDER_CONNECTION_TYPE]: connectionType,
    [ACTIVITY_FIELD]: activity,
  } = values;

  let minBudget;
  let eventsCostCalculated;

  if (connectionType === 1) {
    minBudget = VOICE_CPA_CONNECTION_TAB_1_BUDGET;
    eventsCostCalculated = eventsCost;
  }
  if (connectionType === 2) {
    minBudget = VOICE_CPA_CONNECTION_TAB_2_BUDGET;
    if (activity?.cost) {
      eventsCostCalculated = activity.cost;
    } else {
      eventsCostCalculated = contactCenterMinimalPrice;
    }
  }
  if (connectionType === 3) {
    minBudget = VOICE_CPA_CONNECTION_TAB_3_BUDGET;
  }

  const isBudgetValid = typeof budget !== 'number' ? true : budget >= minBudget;

  const maxEvents = isBudgetValid ? maxQty : 0;
  const minEvents = isBudgetValid ? minQty : 0;

  const avgEvents = Math.round(budget / eventsCostCalculated);

  const isAudienceSmall = selectionCount < maxEvents || selectionCount < avgEvents;
  const youCanAddCount = isAudienceSmall ? avgEvents - selectionCount : 0;

  let eventsName;

  if (connectionType === 1) {
    eventsName = wordFormByCount(avgEvents, eventForms);
  }

  if (connectionType === 2) {
    eventsName = customersFormByCount(avgEvents);
  }

  return {
    minBudget,
    minEvents,
    maxEvents,
    avgEvents: avgEvents || 0,
    isAudienceSmall,
    isBudgetValid,
    eventsName,
    eventsCost: eventsCostCalculated || 0,
    youCanAddCount,
    budgetToDto: isActive ? budget || minBudget : 0,
    connectionTypes,
    isFromCost: !activity?.cost,
  };
};
