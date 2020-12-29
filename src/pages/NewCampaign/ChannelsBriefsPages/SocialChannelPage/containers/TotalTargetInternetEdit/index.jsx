import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from '@reach/router';
import { useForm, useFormState } from 'react-final-form';
import { toJS } from 'mobx';
import { CHANNEL_STUB_TARGET_INTERNET } from 'constants/index';
import { getTargetInternetDateFields } from 'store/NewCampaign/storage/orders-view-to-dto';
import {
  TARGET_INTERNET_BRIEF_FORM_NAME,
} from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/constants';
import { ActionButton } from 'components/buttons/ActionButtons';
import { useSubmitWithStepperValidation } from 'pages/NewCampaign/ChannelsBriefsPages/SocialChannelPage/hooks/use-submit-with-stepper-validation';
import { putOrderRequest } from 'requests/campaigns';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';
import { pushDraftSaveErrorToGA } from 'utils/ga-analytics/utils';
import { STEP_SLUG_CHANNELS } from 'store/NewCampaign/constants';
import { StoresContext } from 'store/mobx';
import confirmDialog from 'components/modals/confirmDialog';
import StartCampaignOrEditModal, { TEMPLATES } from 'components/modals/StartCampaignOrEditModal';
import { useScrollToInvalid } from 'hooks/use-scroll-to-invalid';
import PromocodeErrorModal from 'components/modals/PromocodeErrorModal';
import styles from './styles.pcss';

export default function TotalTargetInternetEditModeration({ onSetActiveStep, onAfterSave, onBeforeSave }) {
  const { Social, NewCampaign } = useContext(StoresContext);
  const navigate = useNavigate();
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
      await confirmDialog(StartCampaignOrEditModal, { templateSource: TEMPLATES.UPDATED });
      submit();
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
    <div className={styles.component}>
      <ActionButton isLight className={styles.button} onClick={handleOrderSubmit}>Отправить</ActionButton>
    </div>

  );
}

TotalTargetInternetEditModeration.propTypes = {
  onSetActiveStep: PropTypes.func,
  onAfterSave: PropTypes.func,
  onBeforeSave: PropTypes.func,
};
