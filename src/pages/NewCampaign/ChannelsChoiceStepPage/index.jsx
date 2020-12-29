import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FeedbackBanner } from 'widgets';
import { calculateAllOrderEventsCount } from 'store/NewCampaign/steps/actions/update';
import { OverlayLoader } from 'components/common/Loaders/components';
import {
  getCampaignAudienceStep,
} from 'store/common/templates/newCampaign/selectors';
import PageLayout from 'pages/_PageLayout';
import QuestionWidget from 'containers/QuestionWidget';
import { StepLayout, StepHeading } from '../components';
import { SegmentationWrapper } from '../containers';
import ChannelsWidgets from '../ChannelsBriefsPages/containers/ChannelsWidgets';
import { TotalBlock } from '../ChannelsBriefsPages/containers';
import ChatWidget from '../../../containers/ChatWidget';
import styles from './styles.pcss';

export default function ChannelsChoiceStepPage() {
  const { title, description } = useSelector(getCampaignAudienceStep);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const calculating = async () => {
      setLoading(true);
      dispatch(calculateAllOrderEventsCount());
      setLoading(false);
    };
    calculating();
  }, []);

  return (
    <PageLayout>
      <SegmentationWrapper>
        <StepLayout className={styles.section}>
          <div className={styles.infoWrapper}>
            <StepHeading title={title} description={description} className={styles.text} />
          </div>
        </StepLayout>

        <OverlayLoader isLoading={loading}>
          <ChannelsWidgets className={styles.section} />
        </OverlayLoader>

        <FeedbackBanner />
      </SegmentationWrapper>

      <ChatWidget />

      <QuestionWidget />
    </PageLayout>
  );
}
