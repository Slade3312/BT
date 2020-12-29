import { useFormState } from 'react-final-form';
import NewCampaign from 'store/mobx/NewCampaign';
import Templates from 'store/mobx/Templates';
import { wordFormByCount } from 'utils/fn';
import { ACTIVITY_FIELD, ORDER_CONNECTION_TYPE } from 'store/NewCampaign/channels/constants';
import { customersFormByCount } from 'utils/date';
import Common from 'store/mobx/Common';

export const useVoiceChannelCalculatedInfo = () => {
  let { connectionTypes } = NewCampaign;
  const { activityFields } = NewCampaign;
  connectionTypes = connectionTypes.map((item) => {
    return {
      ...item,
      value: item.id,
    };
  });

  const orderFormData = NewCampaign.calculate || {};
  const budget = NewCampaign.currentCampaign.currentOrder.budget || NewCampaign.currentCampaign.currentOrder.minimalBudget;
  const selectionCount = NewCampaign.currentCampaign.audience; // кол-во человек
  const eventForms = ['клик', 'клика', 'кликов'];
  const { VOICE_CPA_CONNECTION_TAB_1_BUDGET, VOICE_CPA_CONNECTION_TAB_2_BUDGET, VOICE_CPA_CONNECTION_TAB_3_BUDGET } = Common.constants;
  const { event_cost, qty } = orderFormData;
  connectionTypes[0].price = event_cost;

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
    eventsCostCalculated = event_cost;
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

  const maxEvents = isBudgetValid ? qty : 0;
  const minEvents = isBudgetValid ? qty : 0;

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
    budgetToDto: budget || minBudget,
    connectionTypes,
    isFromCost: !activity?.cost,
  };
};
