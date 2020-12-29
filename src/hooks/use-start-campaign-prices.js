import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from '@reach/router';
import { getCampaignPromocodeData } from 'store/NewCampaign/campaign/selectors';
import { calcPriceByDiscount } from '../utils/business';
import { requestCampaignById } from '../requests/reports';

export const useStartCampaignPrices = () => {
  const { campaignId } = useParams();

  const [actualCampaignData, setActualCampaignData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const promocodeData = useSelector(getCampaignPromocodeData).all || {};

  const actualOrders = actualCampaignData?.orders?.filter(order => !order.is_empty && order.is_active) || [];

  const channelsPrices = actualOrders.reduce((acc, order) => {
    const curChannelInPromocode = promocodeData.isValid && promocodeData.channels.find(({ channel_type }) => channel_type === order.channel_uid);

    return [...acc, {
      channelType: order.channel_uid,
      discountPrice: curChannelInPromocode && calcPriceByDiscount(
        order.budget,
        curChannelInPromocode.value_type_id,
        curChannelInPromocode.promo_code_value,
      ),
      price: order.budget,
    }];
  }, []);

  const totalBudgetToDto = actualOrders.reduce((acc, order) => acc + order.budget, 0);
  const totalBudgetToDtoWithDiscount = actualOrders.reduce((acc, order) => {
    const curChannelInPromocode = channelsPrices.find(item => item.channelType === order.channel_uid);
    if (curChannelInPromocode && typeof curChannelInPromocode.discountPrice === 'number') {
      return acc + curChannelInPromocode.discountPrice;
    }
    return acc + order.budget;
  }, 0);

  // if we have active and saved channels and corresponding promocode for the channel
  const hasSomeDiscount = actualOrders.some(order => channelsPrices.find(item => typeof item.discountPrice === 'number' && item.channelType === order.channel_uid));

  useEffect(() => {
    const makeRequest = async () => {
      setIsLoading(true);
      try {
        const response = await requestCampaignById(campaignId);
        setActualCampaignData(response);
      } finally {
        setIsLoading(false);
      }
    };
    makeRequest();
  }, [campaignId]);

  return {
    totalBudgetToDto,
    totalBudgetToDtoWithDiscount,
    channelsPrices,
    isLoading,
    hasSomeDiscount,
  };
};
