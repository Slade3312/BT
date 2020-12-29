import { CHANNEL_STUB_INTERNET, CHANNEL_STUB_PUSH, CHANNEL_STUB_SMS, CHANNEL_STUB_VOICE } from 'constants/index';
import { useInternetChannelCalculatedInfo } from './use-internet-channel-calculated-info';
import { useBaseChannelCalculatedInfo } from './use-base-channels-calculated-info';

// some promocodes depends on calculated events, we must pass existing events to check promocode inside request params
export const useRequestPromocodeData = () => {
  const { avgCost: avgCostInternet, avgEvents: avgEventsInternet } = useInternetChannelCalculatedInfo();
  const { avgEvents: avgEventsSms, minEvents: minEventsSms, eventsCost: eventsCostSms } = useBaseChannelCalculatedInfo(CHANNEL_STUB_SMS);
  const { avgEvents: avgEventsPush, minEvents: minEventsPush, eventsCost: eventsCostPush } = useBaseChannelCalculatedInfo(CHANNEL_STUB_PUSH);
  const { avgEvents: avgEventsVoice, minEvents: minEventsVoice, eventsCost: eventsCostVoice } = useBaseChannelCalculatedInfo(CHANNEL_STUB_VOICE);
  // TODO @RomanSineokov, add here logic for target-internet channel, ask for it

  return {
    events: {
      [CHANNEL_STUB_SMS]: {
        qty: minEventsSms || avgEventsSms,
        event_cost: eventsCostSms,
      },
      [CHANNEL_STUB_VOICE]: {
        qty: minEventsVoice || avgEventsVoice,
        event_cost: eventsCostVoice,
      },
      [CHANNEL_STUB_PUSH]: {
        qty: minEventsPush || avgEventsPush,
        event_cost: eventsCostPush,
      },
      [CHANNEL_STUB_INTERNET]: {
        qty: avgEventsInternet,
        event_cost: avgCostInternet,
      },
    },
  };
};
