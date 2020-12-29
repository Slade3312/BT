import { useParams } from '@reach/router';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { putOrderRequest } from 'requests/campaigns';
import { filterValuableFormFields } from 'utils/fn';
import { pushDraftSaveErrorToGA, pushDraftSaveSuccessToGA } from 'utils/ga-analytics/utils';
import { setOrderId, setOrderIsEmpty } from 'store/NewCampaign/storage/actions';
import { getSelectionRequestData } from 'store/NewCampaign/storage/selectors-view-to-dto';
import { STEP_SLUG_CHANNELS } from 'store/NewCampaign/constants';
import { getStore } from 'store';
import { useGetCampaignOrderForms } from 'pages/NewCampaign/hooks/use-get-campaign-order-forms';
import NewCampaign from 'store/mobx/NewCampaign';

const omitEmptyOrderFields = data => ({ ...filterValuableFormFields(data), data: filterValuableFormFields(data.data) });

export const useSaveCampaignOrder = ({ channelType, viewToDtoConverter, customProps }) => {
  const dispatch = useDispatch();
  const { campaignId } = useParams();

  const formValues = useGetCampaignOrderForms()[channelType];
  const { locations } = useSelector(getSelectionRequestData);
  return useCallback(async () => {
    const requestPayload = {
      campaignId,
      channelType,
      data: {
        ...omitEmptyOrderFields(viewToDtoConverter(formValues, getStore().getState(), customProps)),
        locations: locations || [],
        ignore_promo_code: customProps?.ignorePromocode,
      },
    };

    try {
      const response = await putOrderRequest(requestPayload);

      const { order_id: orderId, is_empty: isEmpty } = response;

      pushDraftSaveSuccessToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: channelType });

      dispatch(setOrderIsEmpty(channelType, isEmpty));
      dispatch(setOrderId({ channelType, orderId }));

      if (customProps.ignorePromocode) {
        NewCampaign.set('promocodeError', '');
        NewCampaign.set('ignorePromocodeId', null);
      }

      return response;
    } catch (e) {
      const errorResponse = e?.response || {};

      if (errorResponse?.status === 400 && errorResponse?.data?.promo_code_error) {
        NewCampaign.set('promocodeError', errorResponse?.data?.promo_code_error);
        NewCampaign.set('ignorePromocodeId', errorResponse?.data?.error_promo_code_id);
      }

      pushDraftSaveErrorToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: channelType });
      throw e;
    }
  }, [formValues]);
};
