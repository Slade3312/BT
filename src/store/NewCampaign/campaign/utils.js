import { filterValuable, passAsIs } from 'utils/fn';

import {
  GEO_TYPES,
  CHANNEL_STUB_INTERNET,
  CHANNEL_STUB_PUSH,
  CHANNEL_STUB_SMS,
  CHANNEL_STUB_VOICE,
  CHANNEL_STUB_TARGET_INTERNET,
} from 'constants/index';

import { ADCREATINGFORM } from 'pages/NewCampaign/constants';
import NewCampaign from 'store/mobx/NewCampaign';
import {
  ACTIVITY_FIELD, EXTERNAL_OPERATOR,
  GEO_POINTS,
  GEO_TYPE_ACTION,
  ORDER_ADD_INFO_FIELD,
  ORDER_BUDGET_FIELD,
  ORDER_CHOSEN_TARIFF,
  ORDER_COMMENT_FIELD,
  ORDER_CONNECTION_TYPE,
  ORDER_DATE,
  ORDER_FILES_FIELD,
  ORDER_FINISH_DATE_FIELD,
  ORDER_ID,
  ORDER_INDUSTRY_FIELD,
  ORDER_IS_ACTIVE,
  ORDER_LINKS_FIELD,
  ORDER_MESSAGE_FIELD,
  ORDER_MOBILE_VERSION,
  ORDER_SENDER_NAME_FIELD,
  ORDER_SENDING_FIELD,
  ORDER_SERVICES_FIELD,
  ORDER_START_DATE_FIELD,
  ORDER_TARGET_ACTION,
  ORDER_TARIFFS,
  ORDER_TEST_NUMBERS_FIELD,
  ORDER_TOOLS_FIELD,
  ORDER_URL_ADVERTISER_FIELD,
  USE_ONLINE_GEO,
  WAY_TO_MAKE_CALL,
} from '../channels/constants';
import { SUBGROUP_TAXON_PREFIX } from '../taxonomy/constants';
import { TAXON_KEYS } from '../../constants';
import { modifyGeoPoints } from '../storage/utils';
import { getChannelsData } from '../../MyCampaigns/selectors';


const prepareSmsOrderMessageField = (messageText, links) => ({
  text: messageText || null,
  links: links || [],
});

const prepareOrderToolsField = tools => (tools || []).map(item => ({ ...item, isActive: true }));

export const dtoToViewInternetChannelData = ({ data }) => ({
  [ORDER_ADD_INFO_FIELD]: data[ORDER_ADD_INFO_FIELD],
  [ORDER_MOBILE_VERSION]: data[ORDER_MOBILE_VERSION],
  [ORDER_TOOLS_FIELD]: prepareOrderToolsField(data[ORDER_TOOLS_FIELD]),
  [ORDER_INDUSTRY_FIELD]: data[ORDER_INDUSTRY_FIELD],
  [ORDER_URL_ADVERTISER_FIELD]: data[ORDER_URL_ADVERTISER_FIELD],
  [ORDER_TARIFFS]: data[ORDER_TARIFFS],
  [ORDER_CHOSEN_TARIFF]: data[ORDER_CHOSEN_TARIFF],
});

export const dtoToViewSmsChannelData = ({ data, [ORDER_LINKS_FIELD]: links }) => ({
  [ORDER_SENDER_NAME_FIELD]: data[ORDER_SENDER_NAME_FIELD],
  [ORDER_SENDING_FIELD]: data[ORDER_SENDING_FIELD],
  [ORDER_SERVICES_FIELD]: data[ORDER_SERVICES_FIELD],
  [ORDER_MESSAGE_FIELD]: prepareSmsOrderMessageField(data[ORDER_MESSAGE_FIELD], links),
  [USE_ONLINE_GEO]: data[USE_ONLINE_GEO],
  [EXTERNAL_OPERATOR]: data[EXTERNAL_OPERATOR] || false,
  [GEO_POINTS]: data[GEO_POINTS],
  ...(data[ORDER_TEST_NUMBERS_FIELD] ? { [ORDER_TEST_NUMBERS_FIELD]: data[ORDER_TEST_NUMBERS_FIELD].split(',') } : {}),
});

export const dtoToViewVoiceChannelData = ({ data }) => {
  let connectionType;
  let callMethod;

  const { connectionTypes, callMethods } = NewCampaign;

  // Calculate connectionType and callMethod because of BackEnd
  if (data[ORDER_CONNECTION_TYPE]) {
    connectionType = connectionTypes.find((item) => {
      return item.label === data[ORDER_CONNECTION_TYPE];
    });
  }
  if (data[WAY_TO_MAKE_CALL]) {
    callMethod = callMethods.find((item) => {
      return item.label === data[WAY_TO_MAKE_CALL];
    });
  }


  return {
    [ORDER_COMMENT_FIELD]: data[ORDER_COMMENT_FIELD],
    [ORDER_CONNECTION_TYPE]: connectionType ? connectionType.id : 1,
    [WAY_TO_MAKE_CALL]: callMethod ? callMethod.id : 1,
    [ACTIVITY_FIELD]: {
      id: data[ACTIVITY_FIELD],
    },
  };
};

export const dtoToViewPushChannelData = ({ data }) => ({
  [ORDER_TARGET_ACTION]: data[ORDER_TARGET_ACTION],
  [ORDER_URL_ADVERTISER_FIELD]: data[ORDER_URL_ADVERTISER_FIELD],
  [ORDER_MESSAGE_FIELD]: data[ORDER_MESSAGE_FIELD],
  [ORDER_SENDING_FIELD]: data[ORDER_SENDING_FIELD],
  [ORDER_SERVICES_FIELD]: data[ORDER_SERVICES_FIELD],
  ...(data[ORDER_TEST_NUMBERS_FIELD] ? { [ORDER_TEST_NUMBERS_FIELD]: data[ORDER_TEST_NUMBERS_FIELD].split(',') } : {}),
});

const dtoToViewTargetInternetData = ({ data, [ADCREATINGFORM.INDUSTRY_DOCS]: industryDocs, [ADCREATINGFORM.FILES]: imgFiles, ...otherData }) => ({
  [ADCREATINGFORM.TITLE]: data[ADCREATINGFORM.TITLE],
  [ADCREATINGFORM.DESCRIPTION]: data[ADCREATINGFORM.DESCRIPTION],
  [ADCREATINGFORM.BUTTONTEXT]: data[ADCREATINGFORM.BUTTONTEXT],
  [ADCREATINGFORM.WEBSITE]: data[ADCREATINGFORM.WEBSITE],
  [ADCREATINGFORM.UTM]: data[ADCREATINGFORM.UTM],
  [ADCREATINGFORM.MOBILE]: data[ADCREATINGFORM.MOBILE],
  [ADCREATINGFORM.DESKTOP]: data[ADCREATINGFORM.DESKTOP],
  [ADCREATINGFORM.CHOSEN_TARIFF]: data[ADCREATINGFORM.CHOSEN_TARIFF],
  [ADCREATINGFORM.DATE]: isShowDate(otherData) && [otherData.date_start, otherData.date_end],
  [ADCREATINGFORM.AUTO_START]: data[ADCREATINGFORM.AUTO_START],
  [ADCREATINGFORM.INDUSTRY]: data[ADCREATINGFORM.INDUSTRY],
  [ADCREATINGFORM.CLIENT_INFO]: data[ADCREATINGFORM.CLIENT_INFO],
  [ADCREATINGFORM.FILES]: imgFiles,
  [ADCREATINGFORM.INDUSTRY_DOCS]: industryDocs,
});

const getDtoToViewOrderConverter = (channelType) => {
  switch (channelType) {
    case CHANNEL_STUB_SMS:
      return dtoToViewSmsChannelData;
    case CHANNEL_STUB_INTERNET:
      return dtoToViewInternetChannelData;
    case CHANNEL_STUB_VOICE:
      return dtoToViewVoiceChannelData;
    case CHANNEL_STUB_PUSH:
      return dtoToViewPushChannelData;
    case CHANNEL_STUB_TARGET_INTERNET:
      return dtoToViewTargetInternetData;
    default:
      return passAsIs;
  }
};

const isShowDate = fields => !!fields[ORDER_START_DATE_FIELD] || !!fields[ORDER_FINISH_DATE_FIELD];

// to safe put data from draft to form
// we have to control only required fields to initialize into form
export const dtoToViewDraftData = (data, channelType, state) => {
  return {
    [ORDER_IS_ACTIVE]: data.is_active,
    [ORDER_BUDGET_FIELD]: data.budget,
    [ORDER_DATE]: isShowDate(data) && [data.date_start, data.date_end],
    [ORDER_FILES_FIELD]: !!data.files && data.files,
    [ORDER_ID]: data.id,
    ...data?.data ? getDtoToViewOrderConverter(channelType)(data, state) : {},
    // to don't lock navigation slug after init
    isEmpty: data.is_empty,
    isEditable: data.is_editable,
  };
};

export const dtoToViewAnyLocation = (data) => {
  if (data) {
    return Object.keys(data).reduce((acc, key) => {
      const dataByKey = data[key];
      // if has child region
      if (Array.isArray(dataByKey) && dataByKey.length > 0) {
        return [...acc, ...dataByKey];
      }
      return [...acc, key];
    }, []);
  }
  return null;
};

const getGeoType = ({ geoJob, geoHome, geoWeekEnd }) => {
  // we have all types of geo inside store when default is selected
  if (geoJob && geoHome && geoWeekEnd) return TAXON_KEYS.DEFAULT;

  if (geoJob) return TAXON_KEYS.JOB_GEO;
  if (geoHome) return TAXON_KEYS.HOME_GEO;
  if (geoWeekEnd) return TAXON_KEYS.WEEKEND_GEO;

  return null;
};

const dtoToViewGeoTaxons = ({ geoJob, geoHome, geoWeekEnd, anyLocation }) => ({
  [TAXON_KEYS.GEO_POINTS]: geoJob || geoHome || geoWeekEnd,
  [TAXON_KEYS.GEO_TYPE]: getGeoType({ geoJob, geoHome, geoWeekEnd }),
  [TAXON_KEYS.ANY_LOCATION]: dtoToViewAnyLocation(anyLocation),
  [GEO_TYPE_ACTION]: (geoJob || geoHome || geoWeekEnd) ? GEO_TYPES.POINTS : GEO_TYPES.REGIONS,
});

export const dtoToViewSelectionDataByKeys = ({
  [TAXON_KEYS.ANY_LOCATION]: anyLocation,
  [TAXON_KEYS.JOB_GEO]: geoJob,
  [TAXON_KEYS.HOME_GEO]: geoHome,
  [TAXON_KEYS.WEEKEND_GEO]: geoWeekEnd,
  ...otherData
}) => {
  const geoTaxonsData = dtoToViewGeoTaxons({ geoJob, geoHome, geoWeekEnd, anyLocation });
  const mappedGeoTaxons = modifyGeoPoints(geoTaxonsData);

  return filterValuable({
    ...otherData,
    ...geoTaxonsData,
    ...mappedGeoTaxons,
  });
};

const dtoToViewMapTaxonsBySubgroups = (dtoTaxonsData, subgroupsMap) => {
  const resultData = {};
  Object.keys(dtoTaxonsData).forEach((key) => {
    const value = dtoTaxonsData[key];
    if (subgroupsMap[key]) {
      const subgroupKey = `${SUBGROUP_TAXON_PREFIX}${subgroupsMap[key]}`;

      if (!resultData[subgroupKey]) {
        resultData[subgroupKey] = [];
      }
      resultData[subgroupKey].push(key);
    } else {
      resultData[key] = value;
    }
  });
  return resultData;
};

/**
 * subgroup taxons has especially mapping, subgroupMap must contains
 * all plain mapping between any taxon key and subgroup id
 * also we have to enable all subgroup taxons toggles
 */
export const dtoToViewSelectionDraft = ({ data, ...otherFields }, subgroupMap) => {
  const mappedTaxonsData = dtoToViewMapTaxonsBySubgroups(data, subgroupMap);

  return {
    ...otherFields,
    data: mappedTaxonsData ? dtoToViewSelectionDataByKeys(mappedTaxonsData) : {},
  };
};
