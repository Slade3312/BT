import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  getChannelIsChecked,
  getTotalBudgetBySelectedTools,
} from 'store/NewCampaign/storage/selectors';
import { getCommonCampaignChannelTypesById } from 'store/common/campaign/selectors';
import { checkValidToCalculateInternet } from 'store/NewCampaign/channels/selectors';
import { CHANNEL_STUB_INTERNET } from 'constants/index';
import { wordFormByCount } from 'utils/fn';
import { getBudgetEventsName, getCampaignBriefsMap } from 'store/common/templates/newCampaign/briefs-selectors';
import {
  ORDER_CHOSEN_TARIFF,
  ORDER_IS_ACTIVE,
  ORDER_IS_OVERDUE_TARIFFS,
  ORDER_TARIFFS,
  ORDER_TOOLS_FIELD,
} from 'store/NewCampaign/channels/constants';
import { useGetCampaignOrderForms } from 'pages/NewCampaign/hooks/use-get-campaign-order-forms';
import { getSelectedMediaplansByChosenTariff } from '../InternetChannelPage/hooks/use-selected-mediaplan-data.js';
import { useCommonCalculatorEvents } from './use-common-calculator-events';

export const useInternetChannelCalculatedInfo = () => {
  const orderFormData = useGetCampaignOrderForms()[CHANNEL_STUB_INTERNET] || {};
  const channelTypeData = useSelector(getCommonCampaignChannelTypesById)[CHANNEL_STUB_INTERNET];
  const currentBrief = useSelector(getCampaignBriefsMap)[CHANNEL_STUB_INTERNET];

  const {
    [ORDER_IS_OVERDUE_TARIFFS]: isOverdueTariffs,
    [ORDER_CHOSEN_TARIFF]: chosenTariff,
    [ORDER_TARIFFS]: tariffs,
    [ORDER_TOOLS_FIELD]: tools,
    [ORDER_IS_ACTIVE]: isActive,
  } = orderFormData;

  const budgetBySelectedTools = getTotalBudgetBySelectedTools(tools);
  const isChannelChecked = getChannelIsChecked(orderFormData);
  const eventForms = getBudgetEventsName(currentBrief);

  const isOrderValidToCalculate = checkValidToCalculateInternet(orderFormData, channelTypeData);

  const selectedTariff = useMemo(() => getSelectedMediaplansByChosenTariff(chosenTariff, tariffs), [
    chosenTariff,
    tariffs,
  ]);

  const { minEvents, maxEvents, eventsName } = useCommonCalculatorEvents(
    CHANNEL_STUB_INTERNET,
    isOrderValidToCalculate,
  );

  const isMustShowDefaultChannelData = !isChannelChecked || !isOrderValidToCalculate;

  const isMustShowInfoFromTariff = isChannelChecked && isOrderValidToCalculate && !isOverdueTariffs && selectedTariff;

  let showingBudget;
  let showingEventsData;
  let showingEventsName;
  if (isMustShowDefaultChannelData) {
    showingBudget = channelTypeData.minimal_budget;
    showingEventsData = {
      minEvents,
    };
    showingEventsName = eventsName;
  } else if (isMustShowInfoFromTariff) {
    showingBudget = selectedTariff.budget;
    showingEventsData = {
      avgEvents: selectedTariff.totalEvents,
      avgCost: selectedTariff.averageCost,
    };
    showingEventsName = wordFormByCount(selectedTariff.totalEvents, eventForms);
  } else {
    showingBudget = budgetBySelectedTools;
    showingEventsData = {
      minEvents,
      maxEvents,
    };
    showingEventsName = eventsName;
  }

  return {
    eventsName: showingEventsName,
    widgetBudget: showingBudget,
    budgetToDto: isActive ? showingBudget : 0,
    isActive,
    ...showingEventsData,
  };
};
