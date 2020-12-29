import { useDispatch, useSelector } from 'react-redux';
import { useParams } from '@reach/router';
import checkForInn from 'store/mobx/requests/checkForInn';
import { setCampaignLoader } from 'store/NewCampaign/campaign/actions';
import { CAMPAIGN_START } from 'constants/index';
import { startCampaignRequest } from 'requests/campaigns';
import { toggleCampaignSuccess } from 'store/NewCampaign/controls/actions';
import { pushOrderSaveErrorToGA, pushOrderSaveSuccessToGA } from 'utils/ga-analytics/utils';
import { setGlobalErrorData } from 'store/common/errorInfo/actions';
import { ERROR_NON_BLOCKING } from 'store/common/errorInfo/constants';
import { getSelectionRequestData } from 'store/NewCampaign/storage/selectors-view-to-dto';
import { getCampaignPromocodeData } from 'store/NewCampaign/campaign/selectors';
import { NEW_CAMPAIGN_CHANNELS } from 'store/constants';
import { useGetCampaignOrderForms } from 'pages/NewCampaign/hooks/use-get-campaign-order-forms';
import { useGetChannelIsActiveMap } from 'pages/NewCampaign/hooks/use-get-channel-is-active-map';
import { passAsIs } from 'utils/fn';
import { changeOrderIsActiveRequest } from 'requests/orders';

// don't forget use observer hoc where connect this hook
export const useStartCampaign = ({ onSetModalState, onBeforeStart, onAfterStart }) => {
  const { campaignId } = useParams();

  const dispatch = useDispatch();

  const orderForms = useGetCampaignOrderForms();
  const activeChannlesMap = useGetChannelIsActiveMap();

  const { locations } = useSelector(getSelectionRequestData);
  const promocodeData = useSelector(getCampaignPromocodeData).all || {};

  // cause some channels could be inactive in UI but enabled on BE
  // our truth is that we see
  const syncInactiveChannels = async () =>
    Promise.all(Object.keys(orderForms).map(channelType => {
      if (!activeChannlesMap[channelType]) {
        return changeOrderIsActiveRequest({ id: orderForms[channelType].id, is_active: false });
      }
      return null;
    }).filter(passAsIs));


  const handleStartCampaign = async () => {
    const isFilledInn = await checkForInn(
      () => onSetModalState(false),
      () => onSetModalState(true),
    );
    if (!isFilledInn) return;
    dispatch(setCampaignLoader(CAMPAIGN_START, true));

    if (onBeforeStart) {
      onBeforeStart();
    }

    try {
      await syncInactiveChannels();

      await startCampaignRequest({
        campaignId,
        locations,
        onlyValid: true,
        promocodes: promocodeData.isValid ? [{ promo_code: promocodeData.code }] : [],
      });
      dispatch(toggleCampaignSuccess(true));

      Object.keys(NEW_CAMPAIGN_CHANNELS).forEach((key) => {
        if (orderForms[key]?.isActive) {
          pushOrderSaveSuccessToGA({
            orderId: orderForms[key].id,
            campaignId,
            slugTitle: 'new-campaign',
            subSlugTitle: key,
          });
        }
      });
    } catch (e) {
      dispatch(setGlobalErrorData({ statusCode: e.response.status, type: ERROR_NON_BLOCKING }));

      Object.keys(NEW_CAMPAIGN_CHANNELS).forEach((key) => {
        if (orderForms[key]?.isActive) {
          pushOrderSaveErrorToGA({
            orderId: orderForms[key].id,
            campaignId,
            slugTitle: 'new-campaign',
            subSlugTitle: key,
          });
        }
      });
      dispatch(setGlobalErrorData({ statusCode: e.response.status, type: ERROR_NON_BLOCKING }));
      throw e;
    } finally {
      dispatch(setCampaignLoader(CAMPAIGN_START, false));

      if (onAfterStart) {
        onAfterStart();
      }

      onSetModalState(false);
    }
  };

  return handleStartCampaign;
};
