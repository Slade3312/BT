import React from 'react';
import PropTypes from 'prop-types';
import { Router } from '@reach/router';
import {
  AUDIENCE_STATISTIC_URL,
  DASHBOARD_URL,
  NEW_CAMPAIGN_URL,
  USER_INFO_URL,
  FAQ_URL,
  POLLS_PAGE_URL,
} from 'pages/constants';

import SidebarLayout from 'pages/_PageLayout/SidebarLayout';
import MainMenu from 'pages/Dashboard/components/MainMenu/index.jsx';
import NewCampaignSidebar from 'pages/NewCampaign/containers/NewCampaignSidebar';
import FaqSidebar from 'pages/Faq/containers/FaqSidebar';

export default function SidebarRouter({ className }) {
  return (
    <SidebarLayout className={className}>
      <Router basepath="/" primary={false}>
        <MainMenu path={`${DASHBOARD_URL}*`} />

        <MainMenu path={`${AUDIENCE_STATISTIC_URL}*`} />

        <NewCampaignSidebar path={`${NEW_CAMPAIGN_URL}*`} />

        <MainMenu path={`${USER_INFO_URL}*`} />

        <MainMenu path={`${POLLS_PAGE_URL}*`} />

        <FaqSidebar path={`${FAQ_URL}*`} />
      </Router>
    </SidebarLayout>
  );
}

SidebarRouter.propTypes = {
  className: PropTypes.string,
};
