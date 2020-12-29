import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { navigate } from '@reach/router';
import { useForm, useFormState } from 'react-final-form';
import { StoresContext } from 'store/mobx';
import { FormField } from 'components/forms';
import { FFTextInput } from 'components/fields';
import { CAMPAIGN_NAME_FIELD, CAMPAIGN_API_URL } from 'requests/campaigns/constants';
import { ActionButton } from 'components/buttons/ActionButtons';
import commonStyles from 'styles/common.pcss';
import { mutateCampaignRequest } from 'requests/campaigns';
import { pushDraftSaveErrorToGA, pushDraftSaveSuccessToGA } from 'utils/ga-analytics/utils';
import { StepHeading, StepLayout } from 'pages/NewCampaign/components';
import { axiosAuthorizedRequest } from 'requests/helpers';
import { NEW_CAMPAIGN_URL } from '../../constants';


function NameStepFormBody({ onSetIsLoading }) {
  const { valid } = useFormState();
  const { submit } = useForm();
  const { NewCampaign, Templates } = useContext(StoresContext);

  const handleCreateCampaign = async () => {
    const newCampaignData = await mutateCampaignRequest({
      id: NewCampaign.currentCampaign.id,
      name: NewCampaign.currentCampaign.name,
      uid: NewCampaign.currentCampaign.channel_uid,
    });

    const selectionRequestData = await axiosAuthorizedRequest({
      method: 'PUT',
      url: `${CAMPAIGN_API_URL}${newCampaignData.id}/selection/`,
      data: {
        data: {},
        locations: [],
        type: 'segmentation',
      },
    });
    NewCampaign.currentCampaign.currentOrder.minimalBudget = selectionRequestData.budgets[NewCampaign.currentCampaign.channel_uid];
    NewCampaign.setCurrentCampaign(newCampaignData);
    return newCampaignData;
  };

  const handleSaveCampaign = () => {
    return mutateCampaignRequest({
      id: NewCampaign.currentCampaign.id,
      name: NewCampaign.currentCampaign.name,
      uid: NewCampaign.currentCampaign.channel_uid,
    });
  };

  const handleSubmitStep = async () => {
    submit();

    if (valid) {
      let nextCampaignData = null;

      onSetIsLoading(true);

      try {
        if (!NewCampaign.currentCampaign.id) {
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

  const handleInputKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      event.stopPropagation();
      handleSubmitStep();
    }
  };

  useEffect(() => {
    if (!NewCampaign.currentCampaign.channel_uid) navigate(`${NEW_CAMPAIGN_URL}`);
  }, []);

  return (
    <StepLayout className={commonStyles['marb-s']}>
      <StepHeading
        className={classNames(commonStyles['marb-m'], commonStyles.stepContentWidth)}
        title={Templates.getNewCampaignTemplate('CampaignCommonStep').title}
        description={Templates.getNewCampaignTemplate('CampaignCommonStep').subTitle}
      />

      <div className={commonStyles.stepContentWidth}>
        <FormField label="Название кампании">
          <FFTextInput name={CAMPAIGN_NAME_FIELD} maxLength={50} onKeyDown={handleInputKeyDown} />
        </FormField>

        <ActionButton className={commonStyles['mart-xxs']} onClick={handleSubmitStep}>
          Выбрать аудиторию
        </ActionButton>
      </div>
    </StepLayout>
  );
}

NameStepFormBody.propTypes = {
  onSetIsLoading: PropTypes.func,
};

export default observer(NameStepFormBody);
