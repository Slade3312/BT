import { useCallback } from 'react';
import { useFormState } from 'react-final-form';
import { useSelector } from 'react-redux';
import { CHANNEL_STUB_INTERNET } from 'constants/index';
import { viewToDtoInternetChannel } from 'store/NewCampaign/storage/orders-view-to-dto';
import { putOrderRequest } from 'requests/campaigns';
import { getCommonCampaignChannelTypesById } from 'store/common/campaign/selectors';
import { getCurrentCampaignId } from 'store/NewCampaign/storage/selectors';

export const usePutInternetOrderForm = () => {
  const { values } = useFormState();
  const channelData = useSelector(getCommonCampaignChannelTypesById)[CHANNEL_STUB_INTERNET];
  const campaignId = useSelector(getCurrentCampaignId);

  return useCallback(() => {
    const orderRequestData = {
      campaignId,
      channelType: CHANNEL_STUB_INTERNET,
      data: viewToDtoInternetChannel(values, channelData),
    };

    return putOrderRequest(orderRequestData);
  }, [channelData, campaignId, values]);
};
