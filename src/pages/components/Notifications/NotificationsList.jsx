import React from 'react';
import { connect } from 'react-redux';
import {
  getCampaignDraftSavedIsActive,
  getPushAudienceChangedIsActive,
} from 'store/notifications/selectors';

import { CampaignSavedDraftNotification, PushAudienceChangedNotification } from './containers';

const NotificationsList = ({ isCampaignSavedDraftActive, isPushAudienceChangedActive }) =>
  [
    {
      id: 1,
      Component: CampaignSavedDraftNotification,
      isActive: isCampaignSavedDraftActive,
    },
    {
      id: 2,
      Component: PushAudienceChangedNotification,
      isActive: isPushAudienceChangedActive,
    },
  ].map(({ Component, isActive, id }) => isActive && <Component key={id} />);

export default connect(
  state => ({
    isCampaignSavedDraftActive: getCampaignDraftSavedIsActive(state),
    isPushAudienceChangedActive: getPushAudienceChangedIsActive(state),
  }),
  {},
)(NotificationsList);
