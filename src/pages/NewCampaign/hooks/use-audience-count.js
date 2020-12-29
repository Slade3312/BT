import { useContext } from 'react';
import { useLocation } from '@reach/router';
import { useSelector } from 'react-redux';
import { StoresContext } from 'store/mobx';
import { getOrderTargetSmsData } from 'store/NewCampaign/storage/selectors';
import {
  getPushSelectionCount,
  getPushSelectionIsActive,
  getSelectionCount,
} from 'store/NewCampaign/controls/selectors';

export const useAudienceCount = () => {
  const { NewCampaign } = useContext(StoresContext);

  const location = useLocation();

  const count = useSelector(getSelectionCount);
  const isPushActive = useSelector(getPushSelectionIsActive);
  const pushCount = useSelector(getPushSelectionCount);
  const { use_online_geo } = useSelector(getOrderTargetSmsData);

  const getAudienceCount = () => {
    const smsChannelActive = location.pathname.includes('target-sms');

    if (isPushActive) {
      return pushCount;
    }
    if (smsChannelActive && NewCampaign.currentCampaign.audience && use_online_geo) {
      return NewCampaign.currentCampaign.audience;
    }
    if (!isPushActive && (!smsChannelActive || NewCampaign.currentCampaign.audience === undefined || !use_online_geo)) {
      return count;
    }
    return null;
  };

  return getAudienceCount();
};
