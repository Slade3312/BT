import { withPageInitializator } from 'containers/App/enchancers';

import { requestChannelTypes } from 'requests/campaigns';
import { requestAllTaxonsData } from 'requests/bigdata';
import { requestTemplate } from 'requests/templates/request-template';
import { requestOrdersStatuses, requestVoiceCallMethods, requestVoiceConnectionTypes, requestVoiceIndustriesTariffs } from 'requests/orders';
import { requestConstants } from 'requests/constants_';
import { requestHolidaysSettings } from 'requests/settings';
import { requestInfotechIndustries, requestInfotechTools } from 'requests/infotech';
import { setAllTaxonsDtoToViewData } from 'store/NewCampaign/taxonomy/actions';
import { setCampaignAndCommonChannelTypes, setVoiceCallMethods, setVoiceConnectionTypes, setVoiceIndustries } from 'store/NewCampaign/channels/actions';
import { setOrderStatuses } from 'store/common/ordersStatuses/actions';
import { setCommonConstants } from 'store/common/commonConstants/actions';
import { setHolidaySettings } from 'store/settings/actions';
import { setTemplateCreator } from 'store/common/templates/actions';
import { setIndustries, setTools } from 'store/NewCampaign/dictionaries/actions';

const constants = {
  request: requestConstants,
  actionSetter: setCommonConstants,
};

const templatesNotifications = {
  request: () => requestTemplate('notifications'),
  actionSetter: setTemplateCreator('notifications'),
};

// New voice requests

const voiceConnectionTypes = {
  request: requestVoiceConnectionTypes,
  actionSetter: setVoiceConnectionTypes,
};

const loadMyCampaignsPage = () => import('pages/MyCampaigns');


export const MyCampaignsPage = withPageInitializator(loadMyCampaignsPage)([
  constants,
  voiceConnectionTypes,
  templatesNotifications,
]);
