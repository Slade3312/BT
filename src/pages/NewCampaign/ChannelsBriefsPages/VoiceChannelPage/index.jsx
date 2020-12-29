import React from 'react';
import { useSelector } from 'react-redux';
import PageLayout from 'pages/_PageLayout';
import { OverlayLoader } from 'components/common/Loaders/components';
import { SegmentationWrapper } from 'pages/NewCampaign/containers';
import commonStyles from 'styles/common.pcss';
import { getCampaignLoaders } from 'store/NewCampaign/campaign/selectors';
import { FeedbackBanner } from 'widgets';
import { CHANNEL_STUB_VOICE } from 'constants/index';
import QuestionWidget from 'containers/QuestionWidget';
import ChatWidget from '../../../../containers/ChatWidget';
import VoiceOrderFormBody from './containers/VoiceOrderFormBody';
import VoiceOrderForm from './containers/VoiceOrderForm';

export default function VoiceChannelPage() {
  const isLoading = useSelector(getCampaignLoaders)[CHANNEL_STUB_VOICE];

  return (
    <PageLayout isLeftMenuHide>
      <SegmentationWrapper>
        <OverlayLoader isLoading={isLoading}>
          <VoiceOrderForm>
            <VoiceOrderFormBody />
          </VoiceOrderForm>
        </OverlayLoader>
      </SegmentationWrapper>

      <FeedbackBanner className={commonStyles['mart-s']} />

      <ChatWidget />

      <QuestionWidget />
    </PageLayout>
  );
}
