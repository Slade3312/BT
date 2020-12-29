import React, { useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { set } from 'mobx';
import { StoresContext } from 'store/mobx';

import { OverlayLoader } from 'components/common/Loaders/components';
import PageLayout from 'pages/_PageLayout';
import commonStyles from 'styles/common.pcss';
import { composeRequiredValidator } from 'utils/fieldValidators';
import { CAMPAIGN_NAME_FIELD } from 'requests/campaigns/constants';
import { CAMPAIGN_STEP_FORM_ID } from 'pages/NewCampaign/constants';
import { FinalForm } from 'components/forms';
import { FeedbackBanner } from 'widgets';
import ChatWidget from 'containers/ChatWidget';
import QuestionWidget from 'containers/QuestionWidget';
import NameStepFormBody from './NameStepFormBody';

function NameStepPage() {
  const { NewCampaign } = useContext(StoresContext);

  const handleChange = formValue => {
    set(NewCampaign.currentCampaign, formValue);
  };

  const [isLoading, setIsLoading] = useState(false);
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
          values={NewCampaign.currentCampaign}
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
