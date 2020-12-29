import React, { useRef, useState, useContext, useEffect } from 'react';
import { useNavigate } from '@reach/router';
import { useSelector } from 'react-redux';
import { observer } from 'mobx-react';
import { useForm, useFormState } from 'react-final-form';
import { TotalOrderInfo } from 'pages/NewCampaign/ChannelsBriefsPages/components';
import { OrderSaveButton } from 'pages/NewCampaign/containers';
import {
  getInternetBriefFormOrderTotal,
  getInternetFormOrderEventsName,
} from 'store/common/templates/newCampaign/briefs-selectors';
import { formatFloatWithComma, formatPrice } from 'utils/formatting';
import { wordFormByCount } from 'utils/fn';
import { StoresContext } from 'store/mobx';
import { CHANNEL_STUB_INTERNET } from 'constants/index';
import { useSelectedMediaplanData } from 'pages/NewCampaign/ChannelsBriefsPages/InternetChannelPage/hooks/use-selected-mediaplan-data';
import { putOrderRequest } from 'requests/campaigns';
import { ORDER_ADD_INFO_FIELD,
  ORDER_CHOSEN_TARIFF,
  ORDER_DATE,
  ORDER_FINISH_DATE_FIELD,
  ORDER_INDUSTRY_FIELD,
  ORDER_MOBILE_VERSION,
  ORDER_START_DATE_FIELD,
  ORDER_TOOLS_FIELD,
  ORDER_URL_ADVERTISER_FIELD,
} from 'store/NewCampaign/channels/constants';
import { pushDraftSaveErrorToGA, pushDraftSaveSuccessToGA } from 'utils/ga-analytics/utils';
import { STEP_SLUG_CHANNELS } from 'store/NewCampaign/constants';
import { viewToDtoInternetOrderTools } from 'store/NewCampaign/storage/utils';
import confirmDialog from 'components/modals/confirmDialog';
import { useScrollToInvalid } from 'hooks/use-scroll-to-invalid';
import { INTERNET_ORDER_FORM_ID } from 'pages/NewCampaign/constants';
import StartCampaignOrEditModal, { TEMPLATES } from 'components/modals/StartCampaignOrEditModal';
import PromocodeErrorModal from 'components/modals/PromocodeErrorModal';
import checkForInn from 'store/mobx/requests/checkForInn';

const TotalInfoInternet = () => {
  const { NewCampaign } = useContext(StoresContext);
  const { valid } = useFormState();
  const { submit } = useForm();
  const [anchorNode, setAnchorNode] = useState(null);
  useEffect(() => {
    const formNode = anchorRef?.current ?? document.forms[INTERNET_ORDER_FORM_ID];
    setAnchorNode(formNode);
  }, []);

  const onScroll = useScrollToInvalid(anchorNode);

  const total = useSelector(getInternetBriefFormOrderTotal);
  const budgetEventsName = useSelector(getInternetFormOrderEventsName);

  const navigate = useNavigate();

  const anchorRef = useRef();
  const { budget, totalEvents, averageCost } = useSelectedMediaplanData() || {};
  const eventsFormName = wordFormByCount(totalEvents, budgetEventsName);

  const onOrderSubmit = async () => {
    if (!valid) {
      onScroll();
      submit();
      return;
    }
    try {
      await putOrderRequest({
        campaignId: NewCampaign.currentCampaign.id,
        channelType: CHANNEL_STUB_INTERNET,
        data: {
          [ORDER_START_DATE_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_DATE] && NewCampaign.currentCampaign.currentOrder[ORDER_DATE][0],
          [ORDER_FINISH_DATE_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_DATE] && NewCampaign.currentCampaign.currentOrder[ORDER_DATE][1],
          data: {
            [ORDER_TOOLS_FIELD]: viewToDtoInternetOrderTools(NewCampaign.currentCampaign.currentOrder[ORDER_TOOLS_FIELD]),
            [ORDER_CHOSEN_TARIFF]: NewCampaign.currentCampaign.currentOrder[ORDER_CHOSEN_TARIFF],
            [ORDER_INDUSTRY_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_INDUSTRY_FIELD],
            [ORDER_URL_ADVERTISER_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_URL_ADVERTISER_FIELD],
            [ORDER_ADD_INFO_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_ADD_INFO_FIELD],
            [ORDER_MOBILE_VERSION]: NewCampaign.currentCampaign.currentOrder[ORDER_MOBILE_VERSION],
          },
        },
      });
      if (NewCampaign.currentCampaign.status_id === 5) {
        const isRegistered = await checkForInn();
        if (!isRegistered) return;
        pushDraftSaveSuccessToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: CHANNEL_STUB_INTERNET });
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
      await confirmDialog(StartCampaignOrEditModal, { templateSource: TEMPLATES.FAIL });
      pushDraftSaveErrorToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: CHANNEL_STUB_INTERNET });
    }
  };

  return (
    <div ref={anchorRef}>
      <TotalOrderInfo
        channelType={CHANNEL_STUB_INTERNET}
        totalCount={`${formatPrice(totalEvents)} ${eventsFormName}`}
        budget={`${formatPrice(budget)} ₽`}
        eventsCost={`${formatFloatWithComma(averageCost)} ₽`}
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
};

export default observer(TotalInfoInternet);
