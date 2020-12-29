import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import PageLayout from 'pages/_PageLayout';
import { PageLoader } from 'components/common/Loaders/components';
import { ActionButton } from 'components/buttons';
import { StoresContext } from 'store/mobx';
import { ExoticHeading } from 'components/layouts';
import PageContainer from 'pages/Polls/components/PageContainer/PageContainer';
import MarketingPollTopBlock from 'pages/Polls/containers/MarketingPollTopBlock/MarketingPollTopBlock';
import { scrollTo } from 'utils/scroll';
import QuestionWidget from 'containers/QuestionWidget';
import ChatWidget from '../../containers/ChatWidget';
import TestPoll from './components/TestPoll/index';
import CardsContainer from './components/CardsContainer';
import CardAdvises from './containers/CardAdvises';
import CardQuestions from './containers/CardQuestions';
import PollsList from './components/PollsList';
import styles from './styles.pcss';

const Polls = () => {
  const { Templates, Polls: PollsStore, Common } = useContext(StoresContext);
  const { showMoreButton, header } = Templates.getPollsTemplate('PollsList');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    scrollTo(0);

    const requestData = async () => {
      PollsStore.getPollsList();

      setIsLoading(true);

      try {
        await Promise.all([
          Common.getStatuses(),
          Templates.getTemplate('polls'),
          PollsStore.getTariffs(),
          Common.getConstants(),
          PollsStore.getTotalCountByChannelType(),
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    requestData();
  }, []);

  return (
    <PageLoader isLoading={isLoading}>
      <PageLayout>
        <PageContainer>
          <MarketingPollTopBlock />

          <ExoticHeading level={2} className={styles.header}>{header}</ExoticHeading>

          {!PollsStore.totalCountByChannelType ? <TestPoll /> : <PollsList />}

          {(PollsStore.nextCount && PollsStore.nextPageLink) ?
            <div className={styles.buttonHolder}>
              <ActionButton
                slug="arrowRightMinimal"
                className={styles.button}
                onClick={PollsStore.getNextPollsList}
              >
                {showMoreButton} ({PollsStore.nextCount})
              </ActionButton>
            </div> :
            null
          }

          <CardsContainer>
            <CardAdvises />

            <CardQuestions />
          </CardsContainer>
        </PageContainer>

        <ChatWidget />

        <QuestionWidget />
      </PageLayout>
    </PageLoader>
  );
};

export default observer(Polls);
