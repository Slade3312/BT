import { useMemo } from 'react';
import { useBudgetByChannels } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/use-budget-by-channels';
import NewCampaign from 'store/mobx/NewCampaign';
import { getCampaignPromocodeData } from 'store/NewCampaign/campaign/selectors';
import { calcPriceByDiscount } from 'utils/business';

export const usePromocodeChannelsDiscountMap = () => {
  const { promocodeData } = NewCampaign?.currentCampaign?.currentOrder || null;
  const channelByBudgetMap = useBudgetByChannels();

  return useMemo(
    () =>
      (promocodeData.channels || []).reduce((acc, next) => {
        if (channelByBudgetMap[next.channel_type]) {
          const price = channelByBudgetMap[next.channel_type];

          return {
            ...acc,
            [next.channel_type]: {
              channelType: next.channel_type,
              discountPrice: calcPriceByDiscount(
                price,
                next.value_type_id,
                next.promo_code_value,
              ),
              discount: next.promo_code_value,
              price,
            },
          };
        }
        return acc;
      }, {}),
    [promocodeData, channelByBudgetMap],
  );
};
