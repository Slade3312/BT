import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import classNames from 'classnames';
import { StoresContext } from 'store/mobx';
import QuestionWidget from 'containers/QuestionWidget';
import PageLayout from 'pages/_PageLayout';

import {
  PersonalData,
  GoalsStack,
  ChannelsCards,
  AdviceHeadingCampaignGoals,
  AdviceHeadingCampaignOrders,
  MainAdviceHeading,
  AudienceTextBanner,
  PollsTextBanner,
} from 'pages/Dashboard/containers';
import { PageLoader } from 'components/common/Loaders/components';
import { Disclaimer } from 'pages/Dashboard/components';
import AskCreateCampaign from 'components/modals/AskCreateCampaign';
import ChatWidget from 'containers/ChatWidget';
import WebinarSubscribe from 'containers/WebinarSubscribe';

import commonStyles from 'styles/common.pcss';

function Dashboard() {
  const { Templates, Common } = useContext(StoresContext);
  const { dashboard } = Templates.data;

  const { isAskCreateCampaignVisible } = Common;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const requestData = async () => {
      try {
        await Promise.all([
          Common.getIndustries(),
          Common.getConstants(),
          Templates.getTemplate('dashboard'),
          Templates.getTemplate('userInfo'),
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
        <PersonalData className={commonStyles['marb-l']} />

        <MainAdviceHeading className={classNames(commonStyles['marb-m'], commonStyles['padh-m'])} level={2} />

        {/* <AdviceHeadingCampaignGoals />
        <GoalsStack className={commonStyles['marb-xl']} /> */}

        <AdviceHeadingCampaignOrders />
        <ChannelsCards className={commonStyles['marb-xl']} />

        <AudienceTextBanner className={commonStyles['marb-xl']} />

        <PollsTextBanner className={commonStyles['marb-xl']} />

        {/* <FeedbackBannerGA className={commonStyles['marb-se']} /> */}
        <WebinarSubscribe />

        <Disclaimer className={classNames(commonStyles['padh-m'], commonStyles['padv-xs'])} >
          {dashboard?.Disclaimer?.text}
        </Disclaimer>

        {isAskCreateCampaignVisible && <AskCreateCampaign />}

        <ChatWidget />

        <QuestionWidget />
      </PageLayout>
    </PageLoader>
  );
}

export default observer(Dashboard);
