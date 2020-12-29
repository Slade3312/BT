import { useContext, useMemo } from 'react';
import {
  CHANNEL_STUB_INTERNET,
  CHANNEL_STUB_PUSH,
  CHANNEL_STUB_SMS,
  CHANNEL_STUB_TARGET_INTERNET,
  CHANNEL_STUB_VOICE,
} from 'constants/index';
import { StoresContext } from 'store/mobx';
import { useInternetChannelCalculatedInfo } from './use-internet-channel-calculated-info';
import { useBaseChannelCalculatedInfo } from './use-base-channels-calculated-info';

export const useBudgetByChannels = () => {
  const { Social } = useContext(StoresContext);

  const { budgetToDto: internetBudget } = useInternetChannelCalculatedInfo();
  const { budgetToDto: pushBudget } = useBaseChannelCalculatedInfo(CHANNEL_STUB_PUSH);
  const { budgetToDto: smsBudget } = useBaseChannelCalculatedInfo(CHANNEL_STUB_SMS);
  const { budgetToDto: voiceBudget } = useBaseChannelCalculatedInfo(CHANNEL_STUB_VOICE);
  const { budgetToDto: targetInternet } = useBaseChannelCalculatedInfo(CHANNEL_STUB_TARGET_INTERNET);
  // я сделал это так, потому что вся логика связанная с активацией через
  // урл находится в редаксе. Это должно уйти, когда мы перейдём на MobXs
  const targetInternetBudget = targetInternet === 0 ? 0 : Social.getTotalBudget;

  const channelsBudgetMap = {
    [CHANNEL_STUB_PUSH]: pushBudget,
    [CHANNEL_STUB_SMS]: smsBudget,
    [CHANNEL_STUB_VOICE]: voiceBudget,
    [CHANNEL_STUB_INTERNET]: internetBudget,
    [CHANNEL_STUB_TARGET_INTERNET]: targetInternetBudget,
  };

  return useMemo(() => channelsBudgetMap, [internetBudget, pushBudget, smsBudget, voiceBudget, targetInternetBudget]);
};
