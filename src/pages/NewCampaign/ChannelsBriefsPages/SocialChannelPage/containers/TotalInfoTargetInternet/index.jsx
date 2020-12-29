import React, { useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from '@reach/router';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { useForm, useFormState } from 'react-final-form';
import { TotalOrderInfo } from 'pages/NewCampaign/ChannelsBriefsPages/components';
import { OrderSaveButton } from 'pages/NewCampaign/containers';
import { formatPrice } from 'utils/formatting';
import { wordFormByCount } from 'utils/fn';
import { CHANNEL_STUB_TARGET_INTERNET } from 'constants/index';
import StartCampaignOrEditModal, { TEMPLATES } from 'components/modals/StartCampaignOrEditModal';
import { getTargetInternetDateFields } from 'store/NewCampaign/storage/orders-view-to-dto';
import { StoresContext } from 'store/mobx';
import {
  TARGET_INTERNET_BRIEF_FORM_NAME,
} from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/constants';
import { useSubmitWithStepperValidation } from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/hooks/use-submit-with-stepper-validation';
import { putOrderRequest } from 'requests/campaigns';
import { pushDraftSaveErrorToGA, pushDraftSaveSuccessToGA } from 'utils/ga-analytics/utils';
import { STEP_SLUG_CHANNELS } from 'store/NewCampaign/constants';
import confirmDialog from 'components/modals/confirmDialog';
import { useScrollToInvalid } from 'hooks/use-scroll-to-invalid';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';
import PromocodeErrorModal from 'components/modals/PromocodeErrorModal';
import checkForInn from 'store/mobx/requests/checkForInn';

function TotalInfoTargetInternet({ onSetActiveStep }) {
  const { Social, Templates, NewCampaign } = useContext(StoresContext);

  const { eventsNamesByCount } = Templates.getNewCampaignTemplate('BriefOrderInternet');
  const { total } = Templates.getNewCampaignTemplate('BriefOrderInternet').form_order;

  const navigate = useNavigate();

  const eventsFormName = wordFormByCount(
    Social.getTotalEvents,
    eventsNamesByCount || [],
  );

  const [anchorNode, setAnchorNode] = useState(null);
  const onScroll = useScrollToInvalid(anchorNode);
  const { valid } = useFormState();
  const { submit } = useForm();

  useEffect(() => {
    const formNode = anchorRef?.current ?? document.forms[TARGET_INTERNET_BRIEF_FORM_NAME];
    setAnchorNode(formNode);
  }, []);
  const anchorRef = useRef();

  const targetInternetData = toJS(Social.adStep);

  const onOrderSubmit = async () => {
    if (!valid) {
      onScroll();
      submit();
      return;
    }
    try {
      await putOrderRequest({
        campaignId: NewCampaign.currentCampaign.id,
        channelType: CHANNEL_STUB_TARGET_INTERNET,
        data: {
          ...getTargetInternetDateFields(targetInternetData),
          files: [
            targetInternetData[ADCREATINGFORM.FILES][0].id,
            targetInternetData[ADCREATINGFORM.FILES][1].id,
            targetInternetData[ADCREATINGFORM.FILES][2].id,
          ],
          [ADCREATINGFORM.INDUSTRY_DOCS]: targetInternetData[ADCREATINGFORM.INDUSTRY_DOCS].map(fileObj => fileObj.id),
          data: {
            [ADCREATINGFORM.TITLE]: targetInternetData[ADCREATINGFORM.TITLE],
            [ADCREATINGFORM.DESCRIPTION]: targetInternetData[ADCREATINGFORM.DESCRIPTION],
            [ADCREATINGFORM.BUTTONTEXT]: targetInternetData[ADCREATINGFORM.BUTTONTEXT],
            [ADCREATINGFORM.WEBSITE]: targetInternetData[ADCREATINGFORM.WEBSITE],
            [ADCREATINGFORM.UTM]: targetInternetData[ADCREATINGFORM.UTM],
            [ADCREATINGFORM.MOBILE]: targetInternetData[ADCREATINGFORM.MOBILE],
            [ADCREATINGFORM.DESKTOP]: targetInternetData[ADCREATINGFORM.DESKTOP],
            [ADCREATINGFORM.CHOSEN_TARIFF]: targetInternetData[ADCREATINGFORM.CHOSEN_TARIFF],
            [ADCREATINGFORM.AUTO_START]: targetInternetData[ADCREATINGFORM.AUTO_START],
            [ADCREATINGFORM.INDUSTRY]: targetInternetData[ADCREATINGFORM.INDUSTRY],
            [ADCREATINGFORM.CLIENT_INFO]: targetInternetData[ADCREATINGFORM.CLIENT_INFO],
            [ADCREATINGFORM.CREATIVES]: [
              targetInternetData[ADCREATINGFORM.FILES][0].id,
              targetInternetData[ADCREATINGFORM.FILES][1].id,
              targetInternetData[ADCREATINGFORM.FILES][2].id,
            ],
          },
        },
      });
      if (NewCampaign.currentCampaign.status_id === 5) {
        const isRegistered = await checkForInn();
        if (!isRegistered) return;
        pushDraftSaveSuccessToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: CHANNEL_STUB_TARGET_INTERNET });
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
      pushDraftSaveErrorToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: CHANNEL_STUB_TARGET_INTERNET });
      await confirmDialog(StartCampaignOrEditModal, { templateSource: TEMPLATES.FAIL });
      console.log(e);
    }
  };

  const handleOrderSubmit = useSubmitWithStepperValidation({ onSubmit: onOrderSubmit, onSetErrorStep: onSetActiveStep });

  return (
    <>
      <TotalOrderInfo
        channelType={CHANNEL_STUB_TARGET_INTERNET}
        totalCount={`${formatPrice(Social.getTotalEvents)} ${eventsFormName}`}
        budget={`${formatPrice(Social.getTotalBudget)} ₽`}
        totalTitle={total.title}
        budgetTitle={total.budgetTitle}
        costTitle={total.costTitle}
        countName={total.countName}
      >
        <OrderSaveButton onClick={handleOrderSubmit} isLight>
          {total.button}
        </OrderSaveButton>
      </TotalOrderInfo>
    </>
  );
}

TotalInfoTargetInternet.propTypes = {
  onSetActiveStep: PropTypes.func,
};

export default observer(TotalInfoTargetInternet);
