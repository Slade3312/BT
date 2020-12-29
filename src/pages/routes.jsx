import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect, Router } from '@reach/router';
import { getHasNonBlockingError } from 'store/common/errorInfo/selectors';
import { PageLoader } from 'components/common/Loaders/components';
import PageLayout from './_PageLayout';
import AppLayout from './_AppLayout/index';
import {
  NonBlockingErrorPopup,
  NotFoundTrap,
  Notifications,
} from './components';

import {
  AUDIENCE_STATISTIC_REPORT_URL,
  AUDIENCE_STATISTIC_URL,
  DASHBOARD_URL,
  FAQ_URL,
  FAQ_URL_SUBPAGE,
  MY_CAMPAIGNS_URL,
  NEW_CAMPAIGN_URL,
  USER_INFO_URL,
  POLLS_PAGE_URL,
  TINDER_URL, TINDER_LANDING,
} from './constants';

import {
  MyCampaignsPage,
} from './pages';

const DashboardPage = lazy(() => import('pages/Dashboard'));
const AudienceReportPage = lazy(() => import('pages/AudienceReport'));
const AudienceStatisticPage = lazy(() => import('pages/AudienceStatistic'));
const PollsPage = lazy(() => import('pages/Polls'));
const UserInfoPage = lazy(() => import('pages/UserInfo'));
const FaqPage = lazy(() => import('pages/Faq'));
const TinderPage = lazy(() => import('pages/B2B'));
const TinderLanding = lazy(() => import('pages/TinderLanding'));
const NewCampaign = lazy(() => import ('pages/NewCampaign'));

function Routes({ hasNonBlockingError }) {
  return (
    <>
      {hasNonBlockingError && <NonBlockingErrorPopup />}

      <Notifications />

      <Suspense fallback={<PageLoader isLoading />}>
        <Router component={AppLayout} basepath="/" primary={false}>
          <Redirect path="/" from="/" to={DASHBOARD_URL} noThrow />

          <DashboardPage path={DASHBOARD_URL} />

          <TinderPage path={`${TINDER_URL}*`} />

          <NewCampaign path={`${NEW_CAMPAIGN_URL}*`} />

          <UserInfoPage path={USER_INFO_URL} />

          <AudienceStatisticPage path={AUDIENCE_STATISTIC_URL} />

          <AudienceReportPage path={`${AUDIENCE_STATISTIC_REPORT_URL}:campaignId/:orderId`} />

          <MyCampaignsPage path={MY_CAMPAIGNS_URL} />

          <PollsPage path={POLLS_PAGE_URL} />

          <TinderLanding path={TINDER_LANDING} />

          <FaqPage path={FAQ_URL} />

          <FaqPage path={FAQ_URL_SUBPAGE} />

          <PageLayout default>
            <NotFoundTrap default />
          </PageLayout>

          <NotFoundTrap default />
        </Router>
      </Suspense>
    </>
  );
}

Routes.propTypes = {
  hasNonBlockingError: PropTypes.bool,
};

export default connect((state) => ({
  hasNonBlockingError: getHasNonBlockingError(state),
}))(Routes);
