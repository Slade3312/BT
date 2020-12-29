import { useChannelErrorsMap } from 'pages/NewCampaign/hooks/use-channel-errors-map';
import { useGetCampaignOrderForms } from 'pages/NewCampaign/hooks/use-get-campaign-order-forms';
import { CHANNEL_STUB_TARGET_INTERNET } from 'constants/index';

export const useGetChannelIsActiveMap = () => {
  const orderForms = useGetCampaignOrderForms();
  const channelsErrorsMap = useChannelErrorsMap();

  const res = {};

  Object.keys(orderForms).forEach(channelType => {
    if (channelType === CHANNEL_STUB_TARGET_INTERNET) {
      res[channelType] = channelsErrorsMap[channelType] ? false : orderForms[channelType].isActive;
    } else {
      res[channelType] = orderForms[channelType].isActive;
    }
  });

  return res;
};
