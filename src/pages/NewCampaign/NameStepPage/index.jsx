import React, { useContext, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { observer } from 'mobx-react';
import { set } from 'mobx';
import { StoresContext } from 'store/mobx';

import { OverlayLoader } from 'components/common/Loaders/components';
import PageLayout from 'pages/_PageLayout';
import commonStyles from 'styles/common.pcss';
import { composeRequiredValidator } from 'utils/fieldValidators';
import { syncCampaignData } from 'store/NewCampaign/storage/actions/sync';
import { getCampaignData } from 'store/NewCampaign/storage/selectors';
import { CAMPAIGN_NAME_FIELD } from 'requests/campaigns/constants';
import { CAMPAIGN_STEP_FORM_ID } from 'pages/NewCampaign/constants';
import { FinalForm } from 'components/forms';
import { FeedbackBanner } from 'widgets';
import ChatWidget from 'containers/ChatWidget';
import QuestionWidget from 'containers/QuestionWidget';
import NameStepFormBody from './NameStepFormBody';

function NameStepPage() {
  const dispatch = useDispatch();

  const { NewCampaign } = useContext(StoresContext);

  const handleChange = useCallback(formValue => {
    set(NewCampaign.currentCampaign, formValue);

    dispatch(syncCampaignData(formValue));
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const stepFormValues = useSelector(getCampaignData);
  // values from MobX: const stepFormValues = NewCampaign.currentCampaign;

  const getValidators = () => ({
    [CAMPAIGN_NAME_FIELD]: composeRequiredValidator('Обязательное поле'),
  });

  return (
    <PageLayout>
      <OverlayLoader isLoading={isLoading}>
        <FinalForm
          id={CAMPAIGN_STEP_FORM_ID}
          getValidators={getValidators}
          values={stepFormValues}
          onChange={handleChange}
        >
          <NameStepFormBody onSetIsLoading={setIsLoading} />
        </FinalForm>

        <FeedbackBanner className={commonStyles['mart-s']} />

        <ChatWidget />

        <QuestionWidget />
      </OverlayLoader>
    </PageLayout>
  );
}

export default observer(NameStepPage);
