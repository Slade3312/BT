import { useContext, useMemo } from 'react';
import { useAudienceCount } from 'pages/NewCampaign/hooks/use-audience-count';
import { StoresContext } from 'store/mobx';
import { CHANNEL_STUB_TARGET_INTERNET } from 'constants/index';
import { useGetCampaignOrderForms } from 'pages/NewCampaign/hooks/use-get-campaign-order-forms';
import { isNullOrUndefined } from 'utils/fn';

export const useChannelErrorsMap = () => {
  const orderForms = useGetCampaignOrderForms();
  const audienceCount = useAudienceCount();
  const { Common, Social } = useContext(StoresContext);
  return useMemo(() => {
    const res = {};
    Object.keys(orderForms).forEach(channelType => {
      if (channelType === CHANNEL_STUB_TARGET_INTERNET && !isNullOrUndefined(audienceCount)) {
        const validationErrorInfo = audienceCount >= Common.constants?.MY_TARGET_MIN_AUDIENCE ? null :
          `Минимальная аудитория для включения данного канала — ${Social.minimalAudience} человек`;
        res[channelType] = validationErrorInfo;
      } else {
        res[channelType] = null;
      }
    });

    return res;
  }, [orderForms, audienceCount, Common.constants]);
};
