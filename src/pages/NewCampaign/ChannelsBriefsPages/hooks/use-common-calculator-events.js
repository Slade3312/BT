import { useSelector } from 'react-redux';
import { getWidgetsCardById, getWidgetsDefaultEvents } from 'store/common/templates/newCampaign/selectors';
import { getBudgetEventsName, getCampaignBriefsMap } from 'store/common/templates/newCampaign/briefs-selectors';
import { getChannelIsChecked, getTotalEvents } from 'store/NewCampaign/storage/selectors';
import { wordGenitiveFormByCount } from 'utils/fn';
import { useGetCampaignOrderForms } from 'pages/NewCampaign/hooks/use-get-campaign-order-forms';
import NewCampaign from 'store/mobx/NewCampaign';

// calculate word declension according 2 forms by last right number
// return events according business requirements by default events

/* business events showing priority:
  1 - default events (disabled channel or not calculated events yet or not valid local budget "tools")
  2 - events from calculator (when select only tools)
  3 - events from calculator (when select media plans)
*/
const checkIsMustShowDefaultEvents = ({ isChannelChecked, eventsMin, defaultEvents, isOrderValidToCalculate }) =>
  !isChannelChecked || !isOrderValidToCalculate || typeof eventsMin !== 'number' ? defaultEvents : null;

export const useCommonCalculatorEvents = (channelType, isOrderValidToCalculate) => {
  const widget = useSelector(getWidgetsCardById(channelType));
  const currentBrief = useSelector(getCampaignBriefsMap)[channelType];
  const campaignOrderFormData = useGetCampaignOrderForms()[channelType] || {};

  const { qty_min: eventsMin, qty_max: eventsMax } = NewCampaign.calculate.total_events;

  const isChannelChecked = true;
  const eventForms = getBudgetEventsName(currentBrief);

  const defaultEvents = getWidgetsDefaultEvents(widget);

  const isMustShowDefaultEvents = checkIsMustShowDefaultEvents({
    isChannelChecked,
    eventsMin,
    defaultEvents,
    isOrderValidToCalculate,
  });

  const eventsName = wordGenitiveFormByCount(eventsMax || eventsMin, [eventForms[1], eventForms[2]]);

  return {
    eventsName,
    minEvents: isMustShowDefaultEvents ? defaultEvents : eventsMin,
    maxEvents: !isMustShowDefaultEvents && eventsMax,
  };
};
