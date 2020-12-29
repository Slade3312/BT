import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { useParams } from '@reach/router';
import { StoresContext } from 'store/mobx';
import PureButton from 'components/buttons/PureButton';
import AskCreateCampaign from 'components/modals/AskCreateCampaign';

import styles from './styles.pcss';

function QuestionWidgetText() {
  const { Common, Templates } = useContext(StoresContext);
  const { isAskCreateCampaignVisible } = Common;
  const { text } = Templates.getCommonTemplate('QuestionWidget');
  const params = useParams();

  return (
    <>
      <PureButton
        name="question-widget"
        className={styles.container}
        onClick={() => Common.set('isAskCreateCampaignVisible', true)}
      >
        <span className={styles.text}>{text}</span>

        {/* <GlobalIcon slug="roundQuestion" className={styles.icon} /> */}
      </PureButton>

      {isAskCreateCampaignVisible && <AskCreateCampaign campaignId={params.campaignId} />}
    </>
  );
}

export default observer(QuestionWidgetText);
