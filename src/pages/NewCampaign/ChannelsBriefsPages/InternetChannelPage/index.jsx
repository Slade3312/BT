import React from 'react';
import { useSelector } from 'react-redux';
import PageLayout from 'pages/_PageLayout';
import { OverlayLoader } from 'components/common/Loaders/components';
import { getCampaignLoaders } from 'store/NewCampaign/campaign/selectors';
import { CHANNEL_STUB_INTERNET } from 'constants/index';
import QuestionWidget from 'containers/QuestionWidget';
import { SegmentationWrapper } from '../../containers';
import ChatWidget from '../../../../containers/ChatWidget';
import styles from './styles.pcss';
import InternetOrderFormBody from './containers/InternetOrderFormBody';
import InternetOrderForm from './containers/InternetOrderForm';

export default function InternetChannelPage() {
  const isLoading = useSelector(getCampaignLoaders)[CHANNEL_STUB_INTERNET];

  return (
    <PageLayout isLeftMenuHide>
      <SegmentationWrapper className={styles.component}>
        <OverlayLoader isLoading={isLoading}>
          <InternetOrderForm>
            <InternetOrderFormBody />
          </InternetOrderForm>
        </OverlayLoader>
      </SegmentationWrapper>

      <ChatWidget />

      <QuestionWidget />
    </PageLayout>
  );
}
