import React, { useEffect, useContext, useState } from 'react';
import { observer } from 'mobx-react';
import { navigate } from '@reach/router';
import classNames from 'classnames/bind';
import { StoresContext } from 'store/mobx';
import PageLayout from 'pages/_PageLayout';
import { ActionButton } from 'components/buttons';
import commonStyles from 'styles/common.pcss';
import QuestionWidget from 'containers/QuestionWidget';
import { PageLoader } from 'components/common/Loaders/components';

import { NEW_CAMPAIGN_URL } from '../constants';
import ChatWidget from '../../containers/ChatWidget';
import { FiltersForm, TopContent, CampaignsList } from './containers';
import { CampaignsListHeader } from './components';

const cx = classNames.bind(commonStyles);

function MyCampaigns() {
  const { MyCampaigns: myCampaigns, Social, Templates, Common } = useContext(StoresContext);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyCampaignPageData = async () => {
      setLoading(true);
      try {
        await Templates.getTemplate('myCampaigns');
        await Common.getCampaignsChannelTypes();
        await Common.getStatuses();

        await myCampaigns.syncInitialMyCampaigns();
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    loadMyCampaignPageData();
  }, []);

  const handleNewCampaignClick = () => {
    Social.resetInternetTargetData();
    navigate(NEW_CAMPAIGN_URL);
  };

  return (
    <PageLayout isLeftMenuHide>
      <PageLoader isLoading={loading}>
        <TopContent {...Templates?.data?.myCampaigns?.MainHeading} className={cx('padb-l')} />

        <CampaignsListHeader>
          <FiltersForm className={cx('marb-xxxs')} />

          <ActionButton
            onClick={handleNewCampaignClick}
            iconSlug="arrowRightMinimal"
          >
            {Templates?.data?.myCampaigns?.TopFilterPanel?.buttonTitle}
          </ActionButton>
        </CampaignsListHeader>

        <CampaignsList />

        <ChatWidget />

        <QuestionWidget />
      </PageLoader>
    </PageLayout>
  );
}

export default observer(MyCampaigns);
