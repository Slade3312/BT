import { observable, action, runInAction } from 'mobx';
import { navigate } from '@reach/router';
import moment from 'moment';
import { requestCampaignsFocusOrders } from 'requests/reports';
import { createAudienceProfiling, startCampaignRequest } from 'requests/campaigns';
import {
  CHANNEL_TYPE_FOCUS_TYPE_ID,
  REPORTS_LIST_ID,
} from 'pages/AudienceStatistic/constants';
import { CAMPAIGN_STATUSES } from 'constants/index';
import { axiosAuthorizedRequest } from 'requests/helpers';
import { uploadFocusFile } from 'requests/client/upload-order-file';
import {
  FIELD_CAMPAIGN_ID,
  FIELD_FILES,
  FIELD_FILE_NAME,
  FIELD_FILE_SIZE,
  FIELD_BUDGET,
} from 'pages/AudienceStatistic/components/EditCampaignStepper/constants';
import { getCampaignApiUrl } from 'requests/campaigns/constants';
import { findByFocusOrders } from 'store/AudienceStatistic/utils';
import { AUDIENCE_STATISTIC_URL } from 'pages/constants';
import { pushToGA } from 'utils/ga-analytics/data-layer';
import checkForInn from 'store/mobx/requests/checkForInn';
import { extractError } from 'utils/errors';
import { validateFile } from './utils/reportsAndCreateReport';
import Common from './Common';
import Audience from './Audience';
import Templates from './Templates';

import {
  STEP_ERROR_FILE_LOADING,
  STEP_ERROR_PREPARE_ORDER,
  STEP_CALCULATE_COST,
  STEP_ERROR_CALCULATE_COST,
  STEP_ORDER_RESULT,
  TOO_MANY_REQUESTS,
} from './constants';

class CreateReport {
    @observable isModalVisible = false;
    @observable loading = false;
    @observable error = {};
    @observable step = '';
    @observable.ref values = {
      [FIELD_CAMPAIGN_ID]: null,
      [FIELD_FILES]: null,
      [FIELD_FILE_NAME]: '',
      [FIELD_FILE_SIZE]: 0,
      [FIELD_BUDGET]: 0,
    }

    @action set = (property, value) => {
      this[property] = value;
    }

    @action processGoToReports = () => {
      navigate(`${AUDIENCE_STATISTIC_URL}#${REPORTS_LIST_ID}`);
      this.isModalVisible = false;
    };

    getCampaignById = async (campaignId) => {
      return axiosAuthorizedRequest({
        url: getCampaignApiUrl(campaignId),
      });
    }

    // 1 шаг - загрузка файла
    @action processLoadFileStep = async (fileBlob) => {
      if (fileBlob) {
        this.loading = true;
        this.error = {};
        try {
          const error = validateFile(fileBlob);

          if (error) {
            pushToGA({
              event: 'event_b2b_audienceAnalysis',
              action: `loadFile_error_${error.title}`,
              blockName: Templates.getAudienceStatisticTemplate('LoadBaseBanner').title,
            });

            this.values = {
              [FIELD_FILES]: null,
              [FIELD_FILE_NAME]: fileBlob.name,
              [FIELD_FILE_SIZE]: fileBlob.size,
            };
            this.error = error;
            this.step = STEP_ERROR_FILE_LOADING;
            this.isModalVisible = true;
            return;
          }
          const { id: nextFileId } = await uploadFocusFile(fileBlob);
          runInAction(() => {
            this.values = {
              [FIELD_FILES]: nextFileId,
              [FIELD_FILE_NAME]: fileBlob.name,
              [FIELD_FILE_SIZE]: fileBlob.size,
            };
          });

          pushToGA({
            event: 'event_b2b_audienceAnalysis',
            action: 'loadFile_success',
            blockName: Templates.getAudienceStatisticTemplate('LoadBaseBanner').title,
          });
        } catch (error) {
          runInAction(() => {
            this.isModalVisible = true;
            this.step = STEP_ERROR_FILE_LOADING;
            this.error = extractError(error);
            this.values = {
              [FIELD_FILES]: null,
              [FIELD_FILE_NAME]: fileBlob.name,
              [FIELD_FILE_SIZE]: fileBlob.size,
            };
          });

          pushToGA({
            event: 'event_b2b_audienceAnalysis',
            action: `loadFile_error_${this.error.title}`,
            blockName: Templates.getAudienceStatisticTemplate('LoadBaseBanner').title,
          });
        } finally {
          runInAction(() => {
            this.loading = false;
          });
        }
      }
    };

  // 2 шаг
  @action processPrepareOrderStep = async () => {
    const { FOCUS_DRAFT_COUNT, FREE_FOCUS } = Common.constants;

    try {
      this.loading = true;
      const { count } = await requestCampaignsFocusOrders({
        params: {
          channel_type: CHANNEL_TYPE_FOCUS_TYPE_ID,
          status: CAMPAIGN_STATUSES.DRAFT,
        },
      });
      if (count < FOCUS_DRAFT_COUNT) {
        const isCompleted = await this.processCalculateCost();

        if (isCompleted && FREE_FOCUS) {
          await this.processOrderReport({});
        }
      } else {
        runInAction(() => {
          this.error = {
            title: 'Превышено количество черновиков',
            description: 'Удалите черновики из списка отчётов и после этого сохраните данный отчёт.',
            isDraftError: true,
          };
          this.step = STEP_ERROR_PREPARE_ORDER;
          this.isModalVisible = true;
          this.loading = false;
        });

        pushToGA({
          event: 'event_b2b_audienceAnalysis',
          action: `priceCalculation_error_${this.error.title}`,
          blockName: Templates.getAudienceStatisticTemplate('LoadBaseBanner').title,
        });
      }
    } catch (error) {
      runInAction(() => {
        this.step = STEP_ERROR_PREPARE_ORDER;
        this.error = extractError(error);
        this.isModalVisible = true;
        this.loading = false;
      });
      pushToGA({
        event: 'event_b2b_audienceAnalysis',
        action: `priceCalculation_error_${this.error.title}`,
        blockName: Templates.getAudienceStatisticTemplate('LoadBaseBanner').title,
      });
    }
  };

  @action processCalculateCost = async () => {
    const { FREE_FOCUS } = Common.constants;
    this.loading = true;

    const today = moment(new Date()).format('DD.MM.YYYY');
    try {
      const { orders, id } = await createAudienceProfiling({
        campaignName: `Отчет от ${today}`,
        [FIELD_FILES]: [this.values[FIELD_FILES]],
      });
      const { budget } = findByFocusOrders(orders);

      runInAction(() => {
        this.values[FIELD_BUDGET] = budget;
        this.values[FIELD_CAMPAIGN_ID] = id;
        if (!FREE_FOCUS) {
          this.step = STEP_CALCULATE_COST;
        }
      });

      pushToGA({
        event: 'event_b2b_audienceAnalysis',
        action: 'priceCalculation_success',
        blockName: Templates.getAudienceStatisticTemplate('LoadBaseBanner').title,
      });

      return true;
    } catch (error) {
      if (error.response.status === 429) {
        runInAction(() => { this.step = TOO_MANY_REQUESTS; });
        return false;
      }
      runInAction(() => {
        this.error = extractError(error);
        this.step = STEP_ERROR_CALCULATE_COST;
      });
      pushToGA({
        event: 'event_b2b_audienceAnalysis',
        action: `priceCalculation_error_${this.error.title}`,
        blockName: Templates.getAudienceStatisticTemplate('LoadBaseBanner').title,
      });

      return false;
    } finally {
      Audience.getCampaigns();
      runInAction(() => {
        this.isModalVisible = true;
        this.loading = false;
      });
    }
  };

  @action processOrderReport = async ({ promocode } = {}) => {
    if (!Common.constants.FREE_FOCUS) {
      const isFilledInn = await checkForInn(() => { this.isModalVisible = false; });
      if (!isFilledInn) {
        this.isModalVisible = true;
        return;
      }
    }

    const campaignId = this.values[FIELD_CAMPAIGN_ID];

    this.loading = true;

    try {
      await startCampaignRequest({ campaignId, promocodes: promocode ? [{ promo_code: promocode }] : [] });

      this.step = STEP_ORDER_RESULT;

      pushToGA({
        event: 'event_b2b_audienceAnalysis',
        action: 'order_confirmation_success',
        blockName: Templates.getAudienceStatisticTemplate('LoadBaseBanner').title,
      });
    } catch (e) {
      pushToGA({
        event: 'event_b2b_audienceAnalysis',
        action: 'order_confirmation_error',
        blockName: Templates.getAudienceStatisticTemplate('LoadBaseBanner').title,
      });
      throw e;
    } finally {
      Audience.getCampaigns();
      runInAction(() => {
        this.isModalVisible = true;
        this.loading = false;
      });
    }
  };

  @action restoreFromDraft = async (campaignId) => {
    this.loading = true;
    const { orders } = await this.getCampaignById(campaignId);
    runInAction(() => {
      this.loading = false;
      const { budget } = findByFocusOrders(orders);
      this.values[FIELD_CAMPAIGN_ID] = campaignId;
      this.values[FIELD_BUDGET] = budget;
      this.step = STEP_CALCULATE_COST;
      this.isModalVisible = true;
    });
  };
}


const CreateReportStore = new CreateReport();
export default CreateReportStore;
