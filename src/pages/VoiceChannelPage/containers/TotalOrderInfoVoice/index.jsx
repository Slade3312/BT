import React, { useRef, useState, useContext, useEffect } from 'react';
import { useNavigate } from '@reach/router';
import { observer } from 'mobx-react';
import { useForm, useFormState } from 'react-final-form';
import { useVoiceChannelCalculatedInfo } from 'pages/NewCampaign/ChannelsBriefsPages/VoiceChannelPage/hooks/use-voice-calculated-info';
import { formatFloatWithComma, formatPriceWithLabel } from 'utils/formatting';
import { OrderSaveButton } from 'pages/NewCampaign/containers';
import { CHANNEL_STUB_VOICE } from 'constants/index';
import TotalOrderVoiceLayout from 'pages/VoiceChannelPage/components/TotalOrderVoiceLayout/TotalOrderVoiceLayout';
import { StoresContext } from 'store/mobx';
import { ACTIVITY_FIELD,
  ORDER_BUDGET_FIELD,
  ORDER_COMMENT_FIELD,
  ORDER_CONNECTION_TYPE,
  ORDER_DATE,
  ORDER_FINISH_DATE_FIELD,
  ORDER_START_DATE_FIELD,
  WAY_TO_MAKE_CALL,
} from 'store/NewCampaign/channels/constants';
import { useScrollToInvalid } from 'hooks/use-scroll-to-invalid';
import { SMS_ORDER_FORM_ID } from 'pages/NewCampaign/constants';
import { putOrderRequest } from 'requests/campaigns';
import { pushDraftSaveErrorToGA, pushDraftSaveSuccessToGA } from 'utils/ga-analytics/utils';
import { STEP_SLUG_CHANNELS } from 'store/NewCampaign/constants';
import StartCampaignOrEditModal, { TEMPLATES } from 'components/modals/StartCampaignOrEditModal';
import confirmDialog from 'components/modals/confirmDialog';
import PromocodeErrorModal from 'components/modals/PromocodeErrorModal';
import checkForInn from 'store/mobx/requests/checkForInn';
import styles from './styles.pcss';

function TotalOrderInfoVoice() {
  const { Templates, NewCampaign, Common } = useContext(StoresContext);
  const [anchorNode, setAnchorNode] = useState(null);
  const onScroll = useScrollToInvalid(anchorNode);
  const { valid } = useFormState();
  const { submit } = useForm();
  useEffect(() => {
    const formNode = anchorRef?.current ?? document.forms[SMS_ORDER_FORM_ID];
    setAnchorNode(formNode);
  }, []);
  const anchorRef = useRef();
  const { total } = Templates.getNewCampaignTemplate('BriefOrderVoice').form_order;
  const navigate = useNavigate();

  const { avgEvents, eventsCost, budgetToDto } = useVoiceChannelCalculatedInfo();

  const formattedBudget = formatPriceWithLabel(budgetToDto, total.budgetUnit);
  const formattedEventsCost = eventsCost && `${formatFloatWithComma(eventsCost)} ${total.costUnit}`;

  const onOrderSubmit = async () => {
    if (!valid) {
      onScroll();
      submit();
      return;
    }
    const callsData = {
      [ORDER_CONNECTION_TYPE]: NewCampaign.currentCampaign.currentOrder[ORDER_CONNECTION_TYPE],
    };
    if (NewCampaign.currentCampaign.currentOrder[ORDER_CONNECTION_TYPE] === 1) {
      callsData[WAY_TO_MAKE_CALL] = NewCampaign.currentCampaign.currentOrder[WAY_TO_MAKE_CALL];
    }
    if (NewCampaign.currentCampaign.currentOrder[ORDER_CONNECTION_TYPE] === 2) {
      callsData[ACTIVITY_FIELD] = NewCampaign.currentCampaign.currentOrder[ACTIVITY_FIELD].id;
    }
    try {
      await putOrderRequest({
        campaignId: NewCampaign.currentCampaign.id,
        channelType: CHANNEL_STUB_VOICE,
        data: {
          [ORDER_BUDGET_FIELD]: NewCampaign.currentCampaign.currentOrder.budget,
          [ORDER_START_DATE_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_DATE] && NewCampaign.currentCampaign.currentOrder[ORDER_DATE][0],
          [ORDER_FINISH_DATE_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_DATE] && NewCampaign.currentCampaign.currentOrder[ORDER_DATE][1],
          data: {
            [ORDER_COMMENT_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_COMMENT_FIELD],
            ...callsData,
          },
        },
      });
      if (NewCampaign.currentCampaign.status_id === 5) {
        const isRegistered = await checkForInn();
        if (!isRegistered) return;
        pushDraftSaveSuccessToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: CHANNEL_STUB_VOICE });
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
      pushDraftSaveErrorToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: CHANNEL_STUB_VOICE });
      await confirmDialog(StartCampaignOrEditModal, { templateSource: TEMPLATES.FAIL });
      console.log(e);
    }
  };

  return (
    <div ref={anchorRef}>
      <TotalOrderVoiceLayout
        channelType={CHANNEL_STUB_VOICE}
        totalCount={avgEvents}
        budget={formattedBudget}
        eventsCost={formattedEventsCost}
        perEventName={total.unitName}
        totalTitle={total.title}
        budgetTitle={total.budgetTitle}
        costTitle={total.costTitle}
        countName={total.countName}
      >
        <OrderSaveButton
          onClick={onOrderSubmit}
          isLight
          className={styles.orderButton}
        >
          {total.button}
        </OrderSaveButton>
      </TotalOrderVoiceLayout>
    </div>
  );
}

export default observer(TotalOrderInfoVoice);
