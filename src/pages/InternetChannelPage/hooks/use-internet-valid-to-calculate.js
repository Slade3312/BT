import { useFormState } from 'react-final-form';
import { useSelector } from 'react-redux';
import { getCommonCampaignChannelTypesById } from 'store/common/campaign/selectors';
import { checkValidToCalculateInternet } from 'store/NewCampaign/channels/selectors';
import { CHANNEL_STUB_INTERNET } from 'constants/index';

export const useInternetValidToCalculate = () => {
  const { values } = useFormState();

  const channelTypesData = useSelector(getCommonCampaignChannelTypesById);
  const currentChannelTypeData = channelTypesData[CHANNEL_STUB_INTERNET];

  return checkValidToCalculateInternet(values, currentChannelTypeData);
};
