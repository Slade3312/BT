import React, { useContext, useEffect } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import PageLayout from 'pages/_PageLayout';
import QuestionWidget from 'containers/QuestionWidget';
import { SegmentationWrapper } from 'pages/NewCampaign/containers';
import ChatWidget from 'containers/ChatWidget';
import styles from './styles.pcss';
import InternetOrderFormBody from './containers/InternetOrderFormBody';
import InternetOrderForm from './containers/InternetOrderForm';

function InternetChannelPage() {
  const { NewCampaign } = useContext(StoresContext);

  useEffect(() => {
    NewCampaign.getOrdersHolidays('internet');
  }, []);

  return (
    <PageLayout isLeftMenuHide>
      <SegmentationWrapper className={styles.component}>
        <InternetOrderForm>
          <InternetOrderFormBody />
        </InternetOrderForm>
      </SegmentationWrapper>

      <ChatWidget />

      <QuestionWidget />
    </PageLayout>
  );
}

export default observer(InternetChannelPage);
