import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from '@reach/router';
import { observer } from 'mobx-react';
import { useForm, useFormState } from 'react-final-form';
import moment from 'moment';
import { StoresContext } from 'store/mobx';
import { formatFloatWithComma, formatPrice, formatPriceWithLabel } from 'utils/formatting';
import { formatTestPhoneNumbers } from 'store/NewCampaign/storage/orders-view-to-dto';
import { CHANNEL_STUB_PUSH } from 'constants/index';
import { OrderSaveButton } from 'pages/NewCampaign/containers';
import StartCampaignOrEditModal, { TEMPLATES } from 'components/modals/StartCampaignOrEditModal';
import TotalOrderInfo from 'pages/NewCampaign/ChannelsBriefsPages/components/TotalOrderInfo';
import { useBaseChannelCalculatedInfo } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/use-base-channels-calculated-info';
import { useNormalizedPushFields } from 'pages/NewCampaign/ChannelsBriefsPages/PushChannelPage/containers/PushOrderFormBody/hooks/use-normalized-push-fields.js';
import { defaultTimeRange } from 'components/fields/TimeRangeSlider';
import confirmDialog from 'components/modals/confirmDialog';
import { useScrollToInvalid } from 'hooks/use-scroll-to-invalid';
import { SMS_ORDER_FORM_ID } from 'pages/NewCampaign/constants';
import { putOrderRequest } from 'requests/campaigns';
import { pushDraftSaveErrorToGA, pushDraftSaveSuccessToGA } from 'utils/ga-analytics/utils';
import { STEP_SLUG_CHANNELS } from 'store/NewCampaign/constants';
import { ORDER_BUDGET_FIELD,
  ORDER_DATE,
  ORDER_FINISH_DATE_FIELD,
  ORDER_MESSAGE_FIELD,
  ORDER_SENDING_FIELD,
  ORDER_SERVICES_FIELD,
  ORDER_START_DATE_FIELD,
  ORDER_TARGET_ACTION,
  ORDER_TEST_NUMBERS_FIELD,
  ORDER_URL_ADVERTISER_FIELD,
} from 'store/NewCampaign/channels/constants';
import PromocodeErrorModal from 'components/modals/PromocodeErrorModal';
import checkForInn from 'store/mobx/requests/checkForInn';


function TotalOrderInfoPush() {
  const { NewCampaign, WebsAndPhonesTaxons } = useContext(StoresContext);
  const anchorRef = useRef();

  const { avgEvents, maxEvents, minEvents, event_cost, eventsName, budgetToDto }
  = useBaseChannelCalculatedInfo(CHANNEL_STUB_PUSH);

  const { total } = useNormalizedPushFields();

  const navigate = useNavigate();

  const { valid } = useFormState();
  const { submit } = useForm();
  const [anchorNode, setAnchorNode] = useState(null);

  const onScroll = useScrollToInvalid(anchorNode);

  useEffect(() => {
    const formNode = anchorRef?.current ?? document.forms[SMS_ORDER_FORM_ID];
    setAnchorNode(formNode);
  }, []);

  const onOrderSubmit = async () => {
    if (!valid) {
      onScroll();
      submit();
      return;
    }
    try {
      await putOrderRequest({
        campaignId: NewCampaign.currentCampaign.id,
        channelType: CHANNEL_STUB_PUSH,
        data: {
          [ORDER_BUDGET_FIELD]: +NewCampaign.currentCampaign.currentOrder[ORDER_BUDGET_FIELD],
          [ORDER_START_DATE_FIELD]:
            WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' &&
            NewCampaign.currentCampaign.currentOrder[ORDER_DATE][0] ||
            moment(NewCampaign.currentCampaign.currentOrder[ORDER_START_DATE_FIELD]).format('YYYY-MM-DD'),
          [ORDER_FINISH_DATE_FIELD]:
            WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' &&
            NewCampaign.currentCampaign.currentOrder[ORDER_DATE][1] ||
            moment(NewCampaign.currentCampaign.currentOrder[ORDER_FINISH_DATE_FIELD]).format('YYYY-MM-DD'),
          data: {
            [ORDER_TEST_NUMBERS_FIELD]: formatTestPhoneNumbers(NewCampaign.currentCampaign.currentOrder[ORDER_TEST_NUMBERS_FIELD]),
            [ORDER_SENDING_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_SENDING_FIELD] || defaultTimeRange,
            [ORDER_TARGET_ACTION]: NewCampaign.currentCampaign.currentOrder[ORDER_TARGET_ACTION],
            [ORDER_URL_ADVERTISER_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_URL_ADVERTISER_FIELD],
            [ORDER_MESSAGE_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_MESSAGE_FIELD],
            [ORDER_SERVICES_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_SERVICES_FIELD],
          },
        },

      });
      if (NewCampaign.currentCampaign.status_id === 5) {
        const isRegistered = await checkForInn();
        if (!isRegistered) return;
        pushDraftSaveSuccessToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: CHANNEL_STUB_PUSH });
        await NewCampaign.startCampaign();
      }
      submit();
      await confirmDialog(StartCampaignOrEditModal, {
        templateSource: NewCampaign.currentCampaign.status_id === 5 ? TEMPLATES.SUCCESS : TEMPLATES.UPDATED,
      });
      await navigate('/my-campaigns/');
    } catch (e) {
      if (e?.response?.status === 400 && e?.response?.data?.promo_code_error) {
        try {
          const answer = await confirmDialog(PromocodeErrorModal, { description: e.response.data.promo_code_error });
          if (answer) {
            await onOrderSubmit({ ignore_promo_code: e.response.data.error_promo_code_id });
          }
          return;
        } catch (err) {
          console.log(err);
        }
      }
      pushDraftSaveErrorToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: CHANNEL_STUB_PUSH });
      await confirmDialog(StartCampaignOrEditModal, { templateSource: TEMPLATES.FAIL });
    }
  };

  const calculateTotalCount = () => {
    if (avgEvents) {
      return `${formatPrice(avgEvents)} ${eventsName}`;
    }
    if (minEvents || maxEvents) {
      return `от ${formatPrice(minEvents)} до ${formatPrice(maxEvents)} ${eventsName}`;
    }
    return null;
  };

  const formattedBudget = formatPriceWithLabel(budgetToDto, total.budgetUnit);
  const formattedEventsCost = event_cost && `${formatFloatWithComma(event_cost)} ${total.costUnit}`;

  return (
    <div ref={anchorRef}>
      <TotalOrderInfo
        isOnModeration={!NewCampaign.getCampaignPushOrder.is_editable && NewCampaign.currentCampaign.status_id !== 5}
        channelType={CHANNEL_STUB_PUSH}
        totalCount={calculateTotalCount()}
        budget={formattedBudget}
        eventsCost={formattedEventsCost}
        perEventName={total.unitName}
        totalTitle={total.title}
        budgetTitle={total.budgetTitle}
        costTitle={total.costTitle}
        countName={total.countName}
      >
        <OrderSaveButton onClick={onOrderSubmit} isLight>
          {total.button}
        </OrderSaveButton>
      </TotalOrderInfo>
    </div>
  );
}

export default observer(TotalOrderInfoPush);
