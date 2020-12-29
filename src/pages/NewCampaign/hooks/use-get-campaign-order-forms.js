import { useSelector } from 'react-redux';
import { useContext } from 'react';
import { getNewCampaignOrdersData } from 'store/NewCampaign/storage/selectors';
import { StoresContext } from 'store/mobx';
import { CHANNEL_STUB_TARGET_INTERNET } from 'constants/index';

// don't forget use observer hoc for the connected component
export const useGetCampaignOrderForms = () => {
  const { Social } = useContext(StoresContext);

  // TODO move all orders to different MobX stores like Social (check in all project same logic)
  const orderForms = useSelector(getNewCampaignOrdersData);

  return { ...orderForms, [CHANNEL_STUB_TARGET_INTERNET]: Social.adStep };
};
