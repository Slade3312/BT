import { combineReducers } from 'redux';
import headerModel from 'requests/common/data/headerModel';

import { formReducer } from './form';
import { notificationsReducer } from './notifications';
import settingsReducer from './settings/settingsReducer';
import requestsReducer from './requests/reducers';
import { clientReducer } from './common/client';
import breakpointReducers from './common/breakpoint/reducers';
import settingsReducers from './common/settings/reducers';
import userInfoReducer from './common/userInfo/reducers';
import { ordersStatusesReducer } from './common/ordersStatuses';
import { campaignStatusesReducer } from './common/campaignStatuses';
import errorInfoReducer from './common/errorInfo/reducers';
import { constantsReducer } from './common/commonConstants';
import { templatesReducer } from './common/templates';
import faqReducer from './Faq/reducers';
import myCampaignsReducer from './MyCampaigns/myCampaignsReducer';
import channelsReducer from './NewCampaign/channels/reducers';
import taxonsReducer from './NewCampaign/taxonomy/reducers';
import storageReducer from './NewCampaign/storage/reducers';
import controlsReducer from './NewCampaign/controls/reducers';
import { routerReducer } from './reachRouter';
import { commonCampaignReducer } from './common/campaign';
import { dictionariesReducer } from './NewCampaign/dictionaries';
import { campaignReducer } from './NewCampaign/campaign';

export default combineReducers({
  form: formReducer,
  notifications: notificationsReducer,
  settings: settingsReducer,
  requests: requestsReducer,
  header: () => headerModel,
  client: clientReducer,
  templates: templatesReducer,
  common: combineReducers({
    breakpoint: breakpointReducers,
    settings: settingsReducers,
    userInfo: userInfoReducer,
    ordersStatuses: ordersStatusesReducer,
    campaignStatuses: campaignStatusesReducer,
    campaign: commonCampaignReducer,
    errorInfo: errorInfoReducer,
    constants: constantsReducer,
    date: (state = {
      currentDate: new Date().toString(),
    }) => state,
  }),
  faq: faqReducer,
  newCampaign: (state = {}, action) => ({
    campaign: campaignReducer(state.campaign, action),
    dictionaries: dictionariesReducer(state.dictionaries, action),
    myCampaigns: myCampaignsReducer(state.myCampaigns, action),
    channels: channelsReducer(state.channels, action),
    taxons: taxonsReducer(state.taxons, action),
    storage: storageReducer(state.storage, action),
    controls: controlsReducer(state.controls, action),
  }),
  router: routerReducer,
});
