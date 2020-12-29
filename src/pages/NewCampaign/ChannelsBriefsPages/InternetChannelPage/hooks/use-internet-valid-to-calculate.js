import { useFormState } from 'react-final-form';
import { checkValidToCalculateInternet } from 'store/NewCampaign/channels/selectors';
import { CHANNEL_STUB_INTERNET } from 'constants/index';
import Common from 'store/mobx/Common';

export const useInternetValidToCalculate = () => {
  const { values } = useFormState();
  const currentChannelTypeData = Common.getChannelInfoByUid(CHANNEL_STUB_INTERNET);

  return checkValidToCalculateInternet(values, currentChannelTypeData);
};
