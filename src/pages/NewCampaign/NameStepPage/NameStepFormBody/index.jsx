import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { navigate, useLocation } from '@reach/router';
import { useForm, useFormState } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { parse } from 'query-string';
import { StoresContext } from 'store/mobx';
import { FormField } from 'components/forms';
import { FFTextInput } from 'components/fields';
import { CAMPAIGN_NAME_FIELD } from 'requests/campaigns/constants';
import commonStyles from 'styles/common.pcss';
import { getCampaignData, getCampaignEntityData } from 'store/NewCampaign/storage/selectors';
import { getCampaignCommonStep } from 'store/common/templates/newCampaign/selectors';
import { mutateCampaignRequest } from 'requests/campaigns';
import { setCampaignId } from 'store/NewCampaign/storage/actions';
import { calculateAllOrderEventsCount, saveModifiedSegmentationData } from 'store/NewCampaign/steps/actions/update';
import { SYNC_ORDER_DATA } from 'store/NewCampaign/constants';
import { dtoToViewDraftData } from 'store/NewCampaign/campaign/utils';
import { pushDraftSaveErrorToGA, pushDraftSaveSuccessToGA } from 'utils/ga-analytics/utils';
import { StepHeading, StepLayout } from '../../components';
import { StepNavButton } from '../../containers';

function NameStepFormBody({ onSetIsLoading }) {
  const location = useLocation();

  const { valid } = useFormState();
  const { submit } = useForm();

  const dispatch = useDispatch();

  const { NewCampaign } = useContext(StoresContext);

  const { id: existingCampaingId } = useSelector(getCampaignEntityData);
  const campaignData = useSelector(getCampaignData);
  const { title, subTitle, buttonText } = useSelector(getCampaignCommonStep);

  const queryParamsChannels = parse(location.search)?.channels?.split(',') || [];

  const handleCreateCampaign = async () => {
    const newCampaignData = await mutateCampaignRequest({
      id: campaignData.id,
      name: campaignData.name,
      uid: [...queryParamsChannels],
    });

    await dispatch(setCampaignId(newCampaignData.id));
    await dispatch(saveModifiedSegmentationData());
    await dispatch(calculateAllOrderEventsCount());

    // sync default orders data with forms
    newCampaignData?.orders?.forEach((item) => {
      dispatch({
        type: SYNC_ORDER_DATA,
        channelType: item.channel_uid,
        payload: dtoToViewDraftData(item, item.channel_uid),
      });
    });

    // MobX
    // Прямо тут сделать запрос отдельно на пустой селекшен для получения начального selectionId
    NewCampaign.setCurrentCampaign(newCampaignData);

    return newCampaignData;
  };

  const handleSaveCampaign = () => {
    return mutateCampaignRequest({
      id: campaignData.id,
      name: campaignData.name,
      uid: [],
    });
  };

  const handleSubmitStep = async () => {
    submit();

    if (valid) {
      let nextCampaignData = null;

      onSetIsLoading(true);

      try {
        if (!existingCampaingId) {
          nextCampaignData = await handleCreateCampaign();
        } else {
          nextCampaignData = await handleSaveCampaign();
        }
        pushDraftSaveSuccessToGA({ slugTitle: 'campaign', subSlugTitle: '' });
      } catch (e) {
        pushDraftSaveErrorToGA({ slugTitle: 'campaign', subSlugTitle: '' });
        throw e;
      } finally {
        onSetIsLoading(false);
      }
      navigate(`/new-campaign/${nextCampaignData.id}/audience`);
    }
  };

  return (
    <StepLayout className={commonStyles['marb-s']}>
      <StepHeading
        className={classNames(commonStyles['marb-m'], commonStyles.stepContentWidth)}
        title={title}
        description={subTitle}
      />

      <div className={commonStyles.stepContentWidth}>
        <FormField label="Название кампании">
          <FFTextInput name={CAMPAIGN_NAME_FIELD} maxLength={50} />
        </FormField>

        <StepNavButton className={commonStyles['mart-xxs']} onClick={handleSubmitStep}>
          {buttonText}
        </StepNavButton>
      </div>
    </StepLayout>
  );
}

NameStepFormBody.propTypes = {
  onSetIsLoading: PropTypes.func,
};

export default observer(NameStepFormBody);
