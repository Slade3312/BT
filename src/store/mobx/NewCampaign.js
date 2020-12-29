import {
  action,
  observable,
  runInAction,
  computed,
  reaction,
  set,
  autorun,
} from 'mobx';
import moment from 'moment';
import { navigate } from '@reach/router';
import {
  axiosAuthorizedRequest,
  composeAxiosPostRequest,
} from 'requests/helpers';
import { requestAllTaxonsData } from 'requests/bigdata';
import {
  convertListToObjectBy,
  filter,
  filterValuableFormFields,
  isNullOrUndefined,
  map,
} from 'utils/fn';
import { dtoToViewDraftData } from 'store/NewCampaign/campaign/utils';
import { viewToDtoOpenedTaxonsSubgroups } from 'store/NewCampaign/controls/utils';
import {
  CAMPAIGN_STATUSES,
  CHANNEL_STUB_INTERNET,
  CHANNEL_STUB_PUSH,
  CHANNEL_STUB_SMS,
  CHANNEL_STUB_TARGET_INTERNET,
  ORDER_STATUSES,
  PROMOCODE_VALUES_TYPES,
} from 'constants/index';
import { ADCREATINGFORM } from 'pages/NewCampaign/constants';
import CommonStore from 'store/mobx/Common';
import { filterNewCampaignChannels } from 'store/utils';
import { calculateOrderEventsRequest } from 'requests/orders';
import { setSelectionRequest } from 'requests/campaigns';
import { extractError } from 'utils/errors';
import { PUSH_TARGET_ACTIONS } from 'pages/PushChannelPage/constants';
import {
  TAXON_DEPENDENCY_PARENT_FIELD,
  TAXON_GROUP_GEO,
} from '../NewCampaign/taxonomy/constants';

import { convertEmulatorMessage } from '../../pages/NewCampaign/utils';
import {
  ORDER_MESSAGE_FIELD,
  ORDER_START_DATE_FIELD,
  ORDER_FINISH_DATE_FIELD,
  SMS_MESSAGE_MAX_LENGTH,
} from '../NewCampaign/channels/constants';
import { calcPriceByDiscount } from '../../utils/business';

import {
  CAMPAIGN_API_URL,
  getPushSelectionApiUrl,
} from '../../requests/campaigns/constants';
import { debounce } from '../../utils/debounce';
import WebsAndPhonesTaxons from './WebsAndPhonesTaxons';
import {
  collectCitiesArray,
  taxonFrontToBack,
  viewToDtoTaxons,
  getSelectedTaxonsGroupsList,
  getTaxonomyDataWithRightGeo,
  dtoToViewSelectionDraft,
  getActiveTaxonsKeys,
} from './utils/taxons';
import Social, { initialAdStepValues } from './Social';
import Templates from './Templates';
import UserInfo from './UserInfo';

import { allTaxonsBySubgroupsMapIds } from './utils/reportsAndCreateReport';

export const defaultCampaign = {
  id: null,
  name: '',
  orders: null,
  is_editable: true,
  channel_uid: '',
  selection: {
    selection_id: null,
    data: null,
  },
  status_id: null,
  audience: 0,
  currentOrder: {
    minimalBudget: null,
    uid: null,
  },
  promocode: null,
};

const defaultCalculate = {
  event_cost: 0,
  qty: 0,
};

class NewCampaign {
  @observable isNotificationActive;
  @observable isLoading = false;
  @observable startingCampaign = false;
  @observable tools = [];
  @observable isSelectionLoading = false;
  @observable isFirstOnlineGeoRequest = true;
  @observable.shallow allTaxonGroups = [];
  @observable.shallow allTaxonsSubgroups = [];
  @observable.shallow openTaxonsSubgroups = [];
  @observable isCampaignInitializing = true;
  @observable selectedChannelSlug = '';
  @observable connectionTypes = [];
  @observable callMethods = [];
  @observable activityFields = [];
  @observable calculating = false;
  @observable shouldPayForName = false;
  @observable calculate = { ...defaultCalculate };

  @observable isShowMinWebsitesError = false;
  @observable isShowMinPhoneNumbersError = false;
  @observable audienceError = '';
  @observable promocodeError = '';
  @observable ignorePromocodeId = null;
  @observable endDateLoaded = null;
  @observable endDateLoading = false;
  @observable orderDateStartOffset = 0;
  @observable ordersHolidays = {
    sms: {},
    push: {},
    voice: {},
    internet: {},
    social: {},
  };

  @observable currentCampaign = { ...defaultCampaign };

  @action set = (value, data) => {
    this[value] = data;
  };

  @computed get isCampaignInDraft() {
    return this.currentCampaign.status_id === CAMPAIGN_STATUSES.DRAFT;
  }

  @computed get getPriceWithPromocode() {
    const budget =
      this.currentCampaign.currentOrder.budget ||
      CommonStore.getChannelInfoByUid(this.currentCampaign.channel_uid)
        .minimal_budget;
    const currentChannelPromocode = this.currentCampaign?.promocode?.channels?.find(
      (item) => item.channel_type === this.currentCampaign.channel_uid
    );
    if (currentChannelPromocode?.promo_code_value) {
      return calcPriceByDiscount(
        budget,
        currentChannelPromocode.value_type_id,
        currentChannelPromocode.promo_code_value,
      );
    }
    return budget;
  }

  @computed get isCanRecalculateAudience() {
    if (
      // если статус кампании "черновик" или "на согласовании"
      (this.currentCampaign?.status_id === 5 || this.currentCampaign?.status_id === 1) &&
      // если статус заказа "создан"
    this.currentCampaign?.currentOrder?.status_id === 0
    ) {
      return true;
    }
    return false;
  }

  @computed get getPrettyPromocode() {
    const currentChannelPromocode = this.currentCampaign?.promocode?.channels?.find(item => item.channel_type === this.currentCampaign.channel_uid);
    if (
      currentChannelPromocode?.promo_code_value &&
      currentChannelPromocode?.value_type_id
    ) {
      if (currentChannelPromocode.value_type_id === PROMOCODE_VALUES_TYPES.PERCENT) {
        return `${currentChannelPromocode?.promo_code_value} %`;
      } else if (
        currentChannelPromocode.value_type_id === PROMOCODE_VALUES_TYPES.COUNT ||
        currentChannelPromocode.value_type_id === PROMOCODE_VALUES_TYPES.UNIT
      ) {
        return `${currentChannelPromocode?.promo_code_value} ₽`;
      }
    }
    return null;
  }

  @computed get taxonsGroupData() {
    return convertListToObjectBy('group_uid')(this.allTaxonGroups || []);
  }

  @action taxonsGroupParentsTaxonsList(groupId) {
    return (
      this.taxonsGroupData[groupId]?.taxons?.filter(
        (item) => !item[TAXON_DEPENDENCY_PARENT_FIELD]
      ) || []
    );
  }

  @action taxonsGroupChildTaxonsList(groupId) {
    return (
      this.taxonsGroupData[groupId]?.taxons?.filter(
        (item) => item[TAXON_DEPENDENCY_PARENT_FIELD]
      ) || []
    );
  }

  @action taxonsSubGroupTaxonsData(groupId) {
    return convertListToObjectBy('id')(this.allTaxonsSubgroups)[groupId];
  }

  @action setTaxonsSubGroupOpen({ key, flag }) {
    if (flag) {
      this.openTaxonsSubgroups.push(key);
    } else {
      this.openTaxonsSubgroups.splice(this.openTaxonsSubgroups.indexOf(key), 1);
    }
  }

  checkForAudiencePushAndroid = async (targetAction) => {
    if (this.isCanRecalculateAudience === false) return;
    this.isSelectionLoading = true;
    try {
      const request = await axiosAuthorizedRequest({
        method: 'POST',
        url: getPushSelectionApiUrl({ campaignId: this.currentCampaign.id }),
        data: {
          is_android: targetAction === PUSH_TARGET_ACTIONS.APP_DOWNLOAD,
        },
      });
      runInAction(() => {
        this.currentCampaign.audience = request.audience;
      });
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.isSelectionLoading = false;
      });
    }
  };

  @computed get geoTaxonData() {
    return this.taxonsGroupData?.geo || {};
  }

  @computed get geoAnyLocationTaxon() {
    return convertListToObjectBy('taxon_uid')(this.taxonsGroupData?.geo?.taxons || []).any_location;
  }

  @computed get taxonsGroupsWithSelectedTaxons() {
    return getSelectedTaxonsGroupsList(
      this.allTaxonGroups,
      this.currentCampaign.selection.data,
    );
  }

  @computed get subItemsWithWebAndPhones() {
    const dataGroupsArray = getSelectedTaxonsGroupsList(
      this.allTaxonGroups,
      this.currentCampaign.selection.data || {},
    ).filter((group) => group.slug !== TAXON_GROUP_GEO);

    const arrayithPhoneAndWeb = [...dataGroupsArray];

    if (
      this.currentCampaign.channel_uid === 'target-sms' ||
      this.currentCampaign.channel_uid === 'push'
    ) {
      arrayithPhoneAndWeb.splice(
        1,
        0,
        {
          slug: 'webSites',
          title: 'Веб-сайты',
        },
        {
          slug: 'phoneNumbers',
          title: 'Телефонные номера',
        },
      );
    }

    return arrayithPhoneAndWeb;
  }

  @computed get taxonsGroupsListWithWebAndPhones() {
    const dataGroupsArray = getSelectedTaxonsGroupsList(
      this.allTaxonGroups,
      this.currentCampaign.selection.data || {},
    ).filter((group) => group.slug !== TAXON_GROUP_GEO);

    const arrayWithPhoneAndWeb = [...dataGroupsArray];

    if (this.currentCampaign.channel_uid === 'target-sms' || this.currentCampaign.channel_uid === 'push') {
      arrayWithPhoneAndWeb.splice(
        1, 0,
        {
          items: WebsAndPhonesTaxons.webSitesTaxon.manuallySites,
          slug: 'webSites',
          title: 'Веб-сайты',
        },
        {
          items: WebsAndPhonesTaxons.phoneNumbersTaxon.manuallyNumbers,
          slug: 'phoneNumbers',
          title: 'Телефонные номера',
        },
      );
    } else {
      arrayWithPhoneAndWeb.splice(
        1, 0,
        {
          slug: 'webSites',
          title: 'Веб-сайты',
          text: 'Доступно только для каналов SMS и PUSH',
          isDisabled: true,
        },
        {
          slug: 'phoneNumbers',
          title: 'Телефонные номера',
          text: 'Доступно только для каналов SMS и PUSH',
          isDisabled: true,
        },
      );
    }

    return arrayWithPhoneAndWeb;
  }

  @action removeTaxonFromSelected(taxonObj) {
    const { value, key } = taxonObj;
    const taxon = this.currentCampaign.selection.data[key];

    if (taxonObj.key === 'geo_points') {
      const filterRemovedTaxon = (item) =>
        item.lat !== value[0] && item.lng !== value[1];

      this.currentCampaign.selection.data[key] = taxon.filter(filterRemovedTaxon);

      if (this.currentCampaign.selection.data.job_geo) {
        this.currentCampaign.selection.data.job_geo = taxon.filter(filterRemovedTaxon);
      }
      if (this.currentCampaign.selection.data.home_geo) {
        this.currentCampaign.selection.data.home_geo = taxon.filter(filterRemovedTaxon);
      }
      if (this.currentCampaign.selection.data.weekend_geo) {
        this.currentCampaign.selection.data.weekend_geo = taxon.filter(filterRemovedTaxon);
      }
    } else if (typeof taxon === 'object') {
      this.currentCampaign.selection.data[key] = taxon.filter((t) => t !== value);
    } else {
      this.currentCampaign.selection.data[key] = null;
    }

    this.updateSelection();
  }

  @computed get getCampaignTargetInternetOrder() {
    return (
      this.currentCampaign.orders?.find(
        (order) => order.channel_uid === 'target-internet'
      ) || null
    );
  }

  @computed get getCampaignPushOrder() {
    return (
      this.currentCampaign.orders?.find(
        (order) => order.channel_uid === 'push'
      ) || null
    );
  }

  @computed get getCampaignTargetSmSOrder() {
    return this.currentCampaign.is_editable;
  }

  @computed get getTargetInternetErrors() {
    const moderationComment = this.getCampaignTargetInternetOrder
      ?.moderation_comment;
    if (moderationComment) {
      return [moderationComment];
    }
    return (
      this.getCampaignTargetInternetOrder?.data
        ?.my_target_banner_moderation_reasons || []
    );
  }

  @computed get getIsCampaignInTargetInternetModeration() {
    return (
      this.getTargetInternetErrors.length > 0 &&
      this.getCampaignTargetInternetOrder?.status_id ===
        ORDER_STATUSES.IN_PROGRESS &&
      this.currentCampaign.status_id === CAMPAIGN_STATUSES.ON_APPROVAL
    );
  }

  getConnectionTypes = async () => {
    if (this.connectionTypes.length) return;
    const result = await axiosAuthorizedRequest({
      url: '/api/v1/client/voice_industries/connection_types/',
    });
    runInAction(() => {
      this.connectionTypes = result;
    });
  };

  getCallMethods = async () => {
    if (this.callMethods.length) return;
    const result = await axiosAuthorizedRequest({
      url: '/api/v1/client/voice_industries/call_methods/',
    });
    runInAction(() => {
      this.callMethods = result;
    });
  };

  getActivityFields = async () => {
    if (this.activityFields.length) return;
    const result = await axiosAuthorizedRequest({
      url: '/api/v1/client/voice_industries/',
    });
    runInAction(() => {
      this.activityFields = result;
    });
  };

  @action resetCampaign = () => {
    this.currentCampaign = { ...defaultCampaign };
    this.calculate = { ...defaultCalculate };
    WebsAndPhonesTaxons.resetAllCustomSegments();
  };

  @action setCurrentCampaign = (newCampaignData) => {
    const getCallDirectionValue = ({ incoming, outgoing }) => {
      if (incoming) return 'incoming';
      if (outgoing) return 'outgoing';
      return '';
    };

    const preparePhoneNumbers = (numbers) => {
      return numbers.map((number) => {
        if (+number[0] === 7 && number.length === 11) return `+${number}`;
        else if (number.length === 10 && +number[0] === 9) return `+7${number}`;
        else if (+number[0] === 8 && number.length === 11) { return `+7${number.slice(1)}`; }
        return number;
      });
    };

    const preparedTaxons = {};
    Object.keys(this.taxonsGroupData).forEach((groupName) => {
      preparedTaxons[groupName] = this.taxonsGroupData[groupName].taxons;
    });

    const subgroupTaxonsMap = allTaxonsBySubgroupsMapIds(preparedTaxons);

    /* Группировка таксонов по типу для отображения в интерфейсе */
    const preparedSelection = newCampaignData.selection
      ? dtoToViewSelectionDraft(newCampaignData.selection, subgroupTaxonsMap)
      : {};

    // all channels data (don't use it to store formValues, it just data of source campaign model)
    const currentOrders = filterNewCampaignChannels(newCampaignData.orders || []);
    runInAction(() => {
      this.currentCampaign = {
        ...this.currentCampaign,
        id: newCampaignData.id,
        name: newCampaignData.name,
        selection: preparedSelection,
        status_id: newCampaignData.status_id,
        orders: currentOrders,
        promocode:
          (newCampaignData?.promo_codes?.length && {
            ...newCampaignData.promo_codes[0],
            isValid: true,
          }) ||
          null,
        audience: newCampaignData?.selection?.audience,
      };
    });

    const phonesNumbersSegment = newCampaignData.custom_segments?.phone;
    const webSitesSegment = newCampaignData.custom_segments?.site;

    WebsAndPhonesTaxons.set('phoneNumbersTaxon', {
      id: phonesNumbersSegment?.id,
      manuallyNumbers: preparePhoneNumbers(phonesNumbersSegment?.data.phones || []),
      files: phonesNumbersSegment?.custom_segment_files || [],
      callDirection: getCallDirectionValue(phonesNumbersSegment?.data || {}),
      event_depth: phonesNumbersSegment?.event_depth,
      is_active: phonesNumbersSegment?.is_active,
    });

    WebsAndPhonesTaxons.set('webSitesTaxon', {
      id: webSitesSegment?.id,
      manuallySites: webSitesSegment?.data.sites || [],
      files: webSitesSegment?.custom_segment_files || [],
      event_depth: webSitesSegment?.event_depth,
      is_active: webSitesSegment?.is_active,
    });

    currentOrders.forEach((order) => {
      // add here initialization for another channels (to move from Redux to separate stores, like target-internet)
      // use different MobX stores to store brief formValues and other dynamic data, like in target-internet
      if (order.channel_uid === CHANNEL_STUB_TARGET_INTERNET) {
        const preparedValues = filterValuableFormFields(dtoToViewDraftData(order, CHANNEL_STUB_TARGET_INTERNET));

        Social.set('adStep', { ...initialAdStepValues, ...preparedValues });
      }
    });
  };

  @action loadAllTaxonsData = async () => {
    try {
      const { taxonGroups, taxonSubgroups } = await requestAllTaxonsData();

      const preparedTaxons = viewToDtoTaxons(taxonGroups, taxonSubgroups);
      const preparedOpenedTaxonsSubgroups = viewToDtoOpenedTaxonsSubgroups(taxonSubgroups);

      runInAction(() => {
        this.allTaxonGroups = preparedTaxons || [];
        this.allTaxonsSubgroups = taxonSubgroups || [];
        this.openTaxonsSubgroups = preparedOpenedTaxonsSubgroups || [];
      });
    } catch (e) {
      console.error(e);
    }
  };

  @action updateSelection = async ({ isFirstCallForDraft } = {}) => {
    if (!this.currentCampaign.orders || !this.currentCampaign.orders.length) { return; }
    const currentOrder = this.currentCampaign.orders.find((item) => {
      return item.channel_uid === this.currentCampaign.channel_uid;
    });

    this.isSelectionLoading = true;
    /**
     * Unwrap subgroup taxons, they look like { 'subgroup:_' [name1, name2] }
     * and should be converted back to boolean taxons { [name1]: 'true', [name2]: 'true' }
     */

    const activeKeys = getActiveTaxonsKeys(getSelectedTaxonsGroupsList(
      this.allTaxonGroups,
      this.currentCampaign.selection.data,
    ));

    const taxonomyDataWithRightGeo = getTaxonomyDataWithRightGeo(this.currentCampaign.selection.data);

    const activeTaxonomyData = map(taxonomyDataWithRightGeo, (value, key) =>
      activeKeys[key] ? value : null);

    const segmentationData = filter(
      taxonFrontToBack(activeTaxonomyData),
      (val) => !isNullOrUndefined(val),
    );

    const dataToSendInSelection = {
      campaignId: this.currentCampaign.id,
      type: 'segmentation',
      data: segmentationData,
      locations: segmentationData.geo_points
        ? collectCitiesArray(segmentationData.geo_points)
        : [],
    };

    try {
      const selectionRequestData = await setSelectionRequest(dataToSendInSelection);

      runInAction(() => {
        this.currentCampaign.selection.selection_id =
          selectionRequestData.selection_id;
        this.currentCampaign.selection.audience = selectionRequestData.audience;

        this.currentCampaign.currentOrder.minimalBudget =
          selectionRequestData.budgets[this.currentCampaign.channel_uid];

        if (
          WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' &&
          WebsAndPhonesTaxons.phonesOnOfLine === 'offline' &&
          WebsAndPhonesTaxons.hasSegmentsStrategy
        ) {
          if (
            WebsAndPhonesTaxons.webSitesTaxon?.manuallySites?.length >=
            +Templates.getNewCampaignTemplate('WebSitesTaxon')?.minCount
          ) {
            if (isFirstCallForDraft) {
              if (
                isNullOrUndefined(currentOrder.data.msisdns_count) &&
                WebsAndPhonesTaxons.phoneNumbersTaxon?.manuallyNumbers?.length <= +Templates.getNewCampaignTemplate('PhoneNumbersTaxon')?.minCount
              ) WebsAndPhonesTaxons.callIntervalRequests = 'checking';

              else if (currentOrder.data.msisdns_count || currentOrder.data.msisdns_count === 0) {
                this.currentCampaign.audience = currentOrder.data.msisdns_count;
              }
            } else {
              WebsAndPhonesTaxons.callIntervalRequests = 'updating';
            }
          }

          if (WebsAndPhonesTaxons.phoneNumbersTaxon?.manuallyNumbers?.length >= +Templates.getNewCampaignTemplate('PhoneNumbersTaxon')?.minCount) {
            if (!isNullOrUndefined(currentOrder.data.msisdns_count)) this.currentCampaign.audience = currentOrder.data.msisdns_count;
            else {
              WebsAndPhonesTaxons.isPhonesChanged = true;
            }
          }
        } else {
          this.currentCampaign.audience = selectionRequestData.audience;
        }
      });
    } catch (newError) {
      this.set('selectionError', extractError(newError).description);
    } finally {
      this.set('isSelectionLoading', false);
    }
  };

  loadCalculateTariff = async (tariff, campaignId) => {
    try {
      const calculateTariffData = await calculateOrderEventsRequest({
        channel_uid: CHANNEL_STUB_TARGET_INTERNET,
        selection_id: this.currentCampaign.selection.id,
        locations: collectCitiesArray(this.currentCampaign.selection?.data?.geo_points || []),
        campaign_id: campaignId,
        budget: tariff.budget,
        cpc: Social.activeCompanyIndustry.cpc,
        ctr: Social.activeCompanyIndustry.ctr,
      });

      Social.setTariff(tariff.id, { count: calculateTariffData.qty });
    } catch (error) {
      throw error;
    }
  };

  getCalculate = async () => {
    if (
      !this.currentCampaign.selection.id ||
      !this.currentCampaign.id ||
      !this.currentCampaign.channel_uid ||
      (!this.currentCampaign.currentOrder.budget &&
        !this.currentCampaign.currentOrder.minimalBudget)
    ) {
      this.calculating = false;
      return;
    }
    if (!this.getDataForCalculate) {
      this.calculating = false;
      return;
    }
    try {
      if (this.currentCampaign.channel_uid === CHANNEL_STUB_SMS) {
        const emulatorMessageText = convertEmulatorMessage(this.currentCampaign.currentOrder[ORDER_MESSAGE_FIELD]);
        const message_length = emulatorMessageText
          ? emulatorMessageText.length
          : 0;
        if (message_length > SMS_MESSAGE_MAX_LENGTH) return;
      }
      const calculateInfo = await calculateOrderEventsRequest(this.getDataForCalculate);
      runInAction(() => {
        set(this.calculate, calculateInfo);
      });
      if (
        this.currentCampaign.promocode &&
        this.currentCampaign.status_id !== 5
      ) {
        try {
          const {
            channels,
            promo_code,
            promo_code_value_type_id,
            promo_code_value,
            promo_type_id,
          } = await axiosAuthorizedRequest({
            url: `/api/v1/client/campaigns/${this.currentCampaign.id}/get_promo_codes/`,
            method: 'POST',
            data: {
              promo_code: this.currentCampaign.promocode.name,
              context_param: UserInfo.getUserInfoCompany().inn,
              events: {
                [this.currentCampaign.channel_uid]: {
                  ...this.calculate,
                },
              },
            },
          });
          runInAction(() => {
            this.ignorePromocodeId = null;
            this.currentCampaign.promocode = {
              channels,
              name: promo_code,
              promo_code_value_type_id,
              promo_code_value,
              promo_type_id,
              isValid: true,
            };
          });
        } catch (e) {
          console.log(e);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.calculating = false;
      });
    }
  };

  startCampaign = async () => {
    const promocodeData = this.currentCampaign?.promocode || {};
    await axiosAuthorizedRequest({
      url: `/api/v1/client/campaigns/${this.currentCampaign.id}/start/`,
      method: 'POST',
      data: {
        onlyValid: true,
        promo_codes:
          (promocodeData.isValid && [{ promo_code: promocodeData.code }]) || [],
        locations: collectCitiesArray(this.currentCampaign.selection?.data?.geo_points || []),
      },
    });
  };

  getTools = async () => {
    if (this.tools.length) return;
    const response = await axiosAuthorizedRequest({
      url: '/api/v1/infotech/tools/',
    });
    runInAction(() => {
      this.tools = response.map((item) => {
        return {
          ...item,
          budget: CommonStore.constants.MIN_TOOLS_BUDGET,
          isActive: false,
          min: CommonStore.constants.MIN_TOOLS_BUDGET,
          max: CommonStore.constants.MAX_TOOLS_BUDGET,
        };
      });
    });
  };

  @computed get getDataForCalculate() {
    const emulatorMessageText = convertEmulatorMessage(this.currentCampaign.currentOrder[ORDER_MESSAGE_FIELD]);
    if (this.currentCampaign.channel_uid === CHANNEL_STUB_INTERNET) {
      if (
        !this.currentCampaign?.currentOrder?.tools?.length ||
        !this.currentCampaign?.currentOrder?.industry
      ) { return null; }
      return {
        channel_uid: this.currentCampaign.channel_uid,
        selection_id: this.currentCampaign.selection.id,
        locations: collectCitiesArray(this.currentCampaign.selection?.data?.geo_points || []),
        campaign_id: this.currentCampaign.id,
        industry: this.currentCampaign?.currentOrder?.industry,
        tools: this.currentCampaign?.currentOrder?.tools.filter(
          (item) => item.isActive
        ),
        budget:
          +this.currentCampaign.currentOrder.budget ||
          CommonStore.getChannelInfoByUid(this.currentCampaign.channel_uid)
            .minimal_budget,
      };
    }

    if (this.currentCampaign.channel_uid === CHANNEL_STUB_SMS) {
      return {
        channel_uid: this.currentCampaign.channel_uid,
        selection_id: this.currentCampaign.selection.id,
        locations: collectCitiesArray(this.currentCampaign.selection?.data?.geo_points || []),
        use_online_geo: window.location.pathname === `/new-campaign/${this.currentCampaign.id}/audience` ? false : Boolean(this.currentCampaign.currentOrder.use_online_geo),
        campaign_id: this.currentCampaign.id,
        budget:
          +this.currentCampaign.currentOrder.budget ||
          CommonStore.getChannelInfoByUid(this.currentCampaign.channel_uid)
            .minimal_budget,
        message_length: emulatorMessageText ? emulatorMessageText.length : 0,
        external_operator: this.currentCampaign.currentOrder.external_operator,
      };
    }

    if (this.currentCampaign.channel_uid === CHANNEL_STUB_PUSH) {
      return {
        channel_uid: this.currentCampaign.channel_uid,
        selection_id: this.currentCampaign.selection.id,
        locations: collectCitiesArray(this.currentCampaign.selection?.data?.geo_points || []),
        campaign_id: this.currentCampaign.id,
        budget:
          +this.currentCampaign.currentOrder.budget ||
          CommonStore.getChannelInfoByUid(this.currentCampaign.channel_uid)
            .minimal_budget,
        target_action:
          this.currentCampaign.currentOrder.target_action ||
          PUSH_TARGET_ACTIONS.FOLLOW_LINK,
      };
    }
    return {
      channel_uid: this.currentCampaign.channel_uid,
      selection_id: this.currentCampaign.selection.id,
      locations: collectCitiesArray(this.currentCampaign.selection?.data?.geo_points || []),
      campaign_id: this.currentCampaign.id,
      budget:
        +this.currentCampaign.currentOrder.budget ||
        CommonStore.getChannelInfoByUid(this.currentCampaign.channel_uid)
          ?.minimal_budget ||
        0,
    };
  }

  @action getOrdersCurrentCampaign = (id) => {
    return this.currentCampaign?.currentOrder;
  };

  @action getOnlineGeoAudience = async (fieldsArray = []) => {
    if (this.isCanRecalculateAudience === false) return;
    this.isLoading = true;
    this.isSelectionLoading = true;
    try {
      const { audience } = await axiosAuthorizedRequest({
        method: 'POST',
        url: `/api/v1/client/campaigns/${this.currentCampaign.id}/orders_audience/target-sms/`,
        data: fieldsArray,
      });

      if (fieldsArray.length) {
        runInAction(() => {
          this.currentCampaign.audience = audience;
        });
      } else {
        await this.updateSelection();
      }

      runInAction(() => {
        if (this.isFirstOnlineGeoRequest) {
          this.isFirstOnlineGeoRequest = false;
          this.showNotification();
        }
      });
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading = false;
      this.isSelectionLoading = false;
    }
  };

  @action resetOnlineGeoAudience = async () => {
    if (this.isCanRecalculateAudience === false) return;
    try {
      this.isSelectionLoading = true;
      const { audience } = await axiosAuthorizedRequest({
        method: 'POST',
        url: `/api/v1/client/campaigns/${this.currentCampaign.id}/orders_audience/target-sms/`,
        data: [],
      });
      this.currentCampaign.audience = audience;
    } catch (e) {
      console.log(e);
    } finally {
      runInAction(() => {
        this.isSelectionLoading = false;
      });
    }
  };

  @action showNotification = () => {
    this.isNotificationActive = setTimeout(() => {
      this.isNotificationActive = 0;
    }, 4000);
  };

  @action hideNotification = () => {
    this.isNotificationActive = 0;
  };

  @action init = () => {
    this.isFirstOnlineGeoRequest = true;
  };

  @action getCampaignEndDate = async () => {
    this.endDateLoading = true;
    const request = await composeAxiosPostRequest({
      url: `${CAMPAIGN_API_URL}${this.currentCampaign.id}/custom_segment/${WebsAndPhonesTaxons.webSitesTaxon.id}/blacklist_verifying/`,
      data: {
        event_count_min: this.calculate.qty,
      },
    });
    runInAction(() => {
      this.endDateLoading = false;
      this.currentCampaign.currentOrder[ORDER_FINISH_DATE_FIELD] = moment(this.currentCampaign.currentOrder[ORDER_START_DATE_FIELD]).add(request.estimation, 'days');
    });
  };

  @action getChannelOffsetDateStart = async () => {
    try {
      const requestData = await axiosAuthorizedRequest({
        url: `/api/v1/client/campaigns/${this.currentCampaign.id}/channel_offset_date_start/`,
        method: 'POST',
        data: {
          external_operator: this.currentCampaign.currentOrder.external_operator,
        },
      });

      this.orderDateStartOffset = requestData?.offset_date_start;
    } catch (e) {
      console.log('Server Error: ', extractError(e));
    }
  }

  @action getOrdersHolidays = async (type = '') => {
    try {
      const responseArray = await axiosAuthorizedRequest({
        url: '/api/v1/settings/holidays/',
        params: {
          is_sms_holiday: (type === 'sms' || type === 'push') ? true : null,
        },
      });

      if (!this.ordersHolidays) {
        this.ordersHolidays = {
          sms: {},
          push: {},
          voice: {},
          internet: {},
          social: {},
        };
      }

      runInAction(() => {
        responseArray.forEach(item => {
          this.ordersHolidays[type][item.date] = true;
        });
      });
    } catch (e) {
      console.log('Server Error: ', extractError(e));
    }
  }

  checkForNameUsage = async () => {
    const getDate = () => {
      if (
        WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' &&
        this.currentCampaign.currentOrder.date
      ) {
        return this.currentCampaign.currentOrder.date[0];
      }

      if (
        WebsAndPhonesTaxons.webSitesOnOfLine === 'online' &&
        this.currentCampaign.currentOrder.date_start
      ) {
        return this.currentCampaign.currentOrder.date_start;
      }

      return undefined;
    };
    try {
      const { senders_names = [] } = await axiosAuthorizedRequest({
        url: `/api/v1/client/campaigns/${this.currentCampaign.id}/senders_names/`,
        method: 'POST',
        data: {
          date_start: getDate(),
        },
      });
      this.shouldPayForName = !senders_names.some(item => item === this.currentCampaign.currentOrder.nameSender);
    } catch (e) {
      console.log(e);
    }
  }
}

const newCampaign = new NewCampaign();

reaction(
  () => {
    return Social.adStep[ADCREATINGFORM.INDUSTRY];
  },
  () => {
    Social.tariffs.forEach((tariff) => {
      newCampaign.loadCalculateTariff(tariff, newCampaign.currentCampaign.id);
    });
  },
);

// вызываем 'calculate/' при изменении текущего order
reaction(
  () => newCampaign.currentCampaign?.currentOrder,
  debounce(newCampaign.getCalculate, 500),
);

reaction(
  () => newCampaign.calculate.qty,
  () => {
    // код для расчёта даты окончания кампании при включенных онлайн сегментах
    // тоже самое что ниже, только завязан на изменение qty
    // такой подход кажется более очевидным, чем autorun с зависимостями
    if (
      newCampaign.calculate.qty &&
      newCampaign.currentCampaign?.currentOrder?.date_start &&
      newCampaign.currentCampaign?.currentOrder?.budget &&
      WebsAndPhonesTaxons.webSitesOnOfLine === 'online'
    ) {
      debounce(newCampaign.getCampaignEndDate, 500)();
    }
  },
);

reaction(
  () => newCampaign.currentCampaign?.currentOrder?.status_id,
  () => {
    // если открываем кампанию для редактирования первый раз запрос на пересчёт даты происходить не должен
    if (newCampaign.currentCampaign?.currentOrder?.status_id !== 7) {
      newCampaign.shouldRecalculateEndDate = false;
    }
  },
);

reaction(
  () => newCampaign.currentCampaign?.currentOrder.date_start,
  async () => {
    // код для расчёта даты окончания кампании при включенных онлайн сегментах
    if (
      !!newCampaign.currentCampaign?.currentOrder.date_start &&
      !!newCampaign.currentCampaign.currentOrder.budget &&
      WebsAndPhonesTaxons.webSitesOnOfLine === 'online'
    ) {
      await newCampaign.getCampaignEndDate();
    }
  },
);

reaction(
  () => newCampaign.currentCampaign?.currentOrder,
  () => {
    newCampaign.calculating = true;
  },
);

autorun(async () => {
  if (
    // есть кастомные сегменты
    WebsAndPhonesTaxons.hasSegmentsStrategy &&
    // и в онлайн гео есть точки
    newCampaign.currentCampaign?.currentOrder?.geo_points?.length &&
    newCampaign.currentCampaign?.currentOrder?.use_online_geo
  ) {
    // затираем точки и делаем онлайн гео неактивным ME-2649
    await newCampaign.resetOnlineGeoAudience();
    newCampaign.currentCampaign.currentOrder.geo_points = [];
    newCampaign.currentCampaign.currentOrder.use_online_geo = false;
  }
});

reaction(
  () => newCampaign.currentCampaign.currentOrder.is_editable,
  () => {
    // если заказ не редактируемый, то надо редиректить на страницу моих кампаний
    if (newCampaign.currentCampaign.currentOrder.is_editable === false) {
      navigate('/my-campaigns/');
    }
  },
);

reaction(
  () => newCampaign.currentCampaign.currentOrder.external_operator,
  () => {
    if (newCampaign.currentCampaign.channel_uid !== CHANNEL_STUB_SMS) return;
    if (
      newCampaign.currentCampaign.currentOrder.external_operator === true &&
      newCampaign.currentCampaign.currentOrder.budget < CommonStore.constants.EXTERNAL_OPERATOR_MIN_BUDGET
    ) {
      newCampaign.currentCampaign.currentOrder.budget = CommonStore.constants.EXTERNAL_OPERATOR_MIN_BUDGET;
    }

    if (
      newCampaign.currentCampaign.currentOrder?.nameSender?.length &&
      newCampaign.currentCampaign.currentOrder.external_operator === true
    ) {
      newCampaign.checkForNameUsage();
    }
  },
);

reaction(
  () => newCampaign.currentCampaign.currentOrder.external_operator === true,
  async () => {
    if (
      newCampaign.currentCampaign.currentOrder?.use_online_geo === true ||
      newCampaign.currentCampaign.currentOrder?.geo_points?.length
    ) {
      await newCampaign.resetOnlineGeoAudience();
      newCampaign.currentCampaign.currentOrder.geo_points = [];
      newCampaign.currentCampaign.currentOrder.use_online_geo = false;
    }
  },
);

reaction(
  () => WebsAndPhonesTaxons.hasSegmentsStrategy,
  () => {
    if (newCampaign.currentCampaign.currentOrder.external_operator === true && newCampaign.currentCampaign.channel_uid === CHANNEL_STUB_SMS) {
      newCampaign.currentCampaign.currentOrder.external_operator = false;
    }
  },
);

reaction(
  () => newCampaign.currentCampaign?.currentOrder?.external_operator,
  () => {
    if (newCampaign.currentCampaign?.currentOrder?.external_operator === true ||
      newCampaign.currentCampaign?.currentOrder?.external_operator === false &&
      newCampaign.currentCampaign.channel_uid === CHANNEL_STUB_SMS) {
      newCampaign.getChannelOffsetDateStart();
    }

    if (newCampaign.currentCampaign?.currentOrder?.external_operator === false) {
      runInAction(() => {
        newCampaign.calculate.external_operator_qty = null;
        newCampaign.calculate.external_operator_event_cost = null;
      });
    }
  },
);

const checkForName = debounce(newCampaign.checkForNameUsage, 1000);

reaction(
  () => newCampaign.currentCampaign.currentOrder.nameSender ||
    newCampaign.currentCampaign.currentOrder.date ||
    newCampaign.currentCampaign.currentOrder.start_date,
  () => {
    if (
      newCampaign.currentCampaign.currentOrder.nameSender?.length &&
      newCampaign.currentCampaign.channel_uid === CHANNEL_STUB_SMS &&
      newCampaign.currentCampaign.currentOrder?.external_operator === true
    ) {
      checkForName();
    }
  },
);

reaction(
  () => newCampaign.currentCampaign.currentOrder.date,
  () => {
    if (
      newCampaign.currentCampaign.currentOrder.nameSender?.length &&
      newCampaign.currentCampaign.channel_uid === CHANNEL_STUB_SMS &&
      newCampaign.currentCampaign.currentOrder?.external_operator === true
    ) {
      checkForName();
    }
  },
);

export default newCampaign;
