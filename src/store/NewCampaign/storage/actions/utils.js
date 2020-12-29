import { createSelector } from 'reselect';
import { convertEmulatorMessage } from 'pages/NewCampaign/utils';
import { PUSH_TARGET_ACTIONS } from 'pages/NewCampaign/ChannelsBriefsPages/PushChannelPage/constants';

import {
  getInternetOrderFormRawData,
  getPushOrderFormRawData,
  getSmsOrderFormRawData,
} from '../../channels/selectors';
import {
  ORDER_INDUSTRY_FIELD,
  ORDER_MESSAGE_FIELD,
  ORDER_TARGET_ACTION,
  ORDER_TOOLS_FIELD,
} from '../../channels/constants';
import { viewToDtoInternetOrderTools } from '../utils';

export const getSmsToDtoInternetEventsData = createSelector(
  getSmsOrderFormRawData,
  (values) => {
    const emulatorMessageText = convertEmulatorMessage(values[ORDER_MESSAGE_FIELD]);
    return {
      message_length: emulatorMessageText ? emulatorMessageText.length : 0,
      use_online_geo: !!values.use_online_geo,
    };
  },
);

export const getPushToDtoInternetEventsData = createSelector(
  getPushOrderFormRawData,
  values => ({
    target_action: values[ORDER_TARGET_ACTION] === PUSH_TARGET_ACTIONS.APP_DOWNLOAD,
  }),
);

export const getViewToDtoInternetEventsData = createSelector(
  getInternetOrderFormRawData,
  values => ({
    tools: values[ORDER_TOOLS_FIELD] && viewToDtoInternetOrderTools(values[ORDER_TOOLS_FIELD]),
    industry: values[ORDER_INDUSTRY_FIELD],
  }),
);
