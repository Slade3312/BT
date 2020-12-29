import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import PageLayout from 'pages/_PageLayout';
import { SegmentationWrapper } from 'pages/NewCampaign/containers';
import commonStyles from 'styles/common.pcss';
import { FeedbackBanner } from 'widgets';
import QuestionWidget from 'containers/QuestionWidget';
import ChatWidget from 'containers/ChatWidget';
import VoiceOrderFormBody from './containers/VoiceOrderFormBody';
import VoiceOrderForm from './containers/VoiceOrderForm';

function VoiceChannelPage() {
  const { NewCampaign } = useContext(StoresContext);

  useEffect(() => {
    NewCampaign.getOrdersHolidays('voice');
  }, []);

  return (
    <PageLayout isLeftMenuHide>
      <SegmentationWrapper>
        <VoiceOrderForm>
          <VoiceOrderFormBody />
        </VoiceOrderForm>
      </SegmentationWrapper>

      <FeedbackBanner className={commonStyles['mart-s']} />

      <ChatWidget />

      <QuestionWidget />
    </PageLayout>
  );
}

export default observer(VoiceChannelPage);
