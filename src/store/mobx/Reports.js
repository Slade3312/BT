import { observable, action, runInAction, computed, set, get } from 'mobx';
import { axiosAuthorizedRequest } from 'requests/helpers';
import { exampleReportData } from 'store/AudienceStatistic/charts/data';
import { CAMPAIGN_EXAMPLE_ID, ORDER_EXAMPLE_ID } from 'store/AudienceStatistic/reportData/constants';
import { CHANNEL_TYPE_FOCUS } from 'pages/AudienceStatistic/constants';
import { formatDateBySplitter } from 'utils/date';
import { exampleCampaignData } from 'store/AudienceStatistic/reportData/data';
import { getCampaignApiUrl } from 'requests/campaigns/constants';
import { groupAndPrepareCharts, useReportCoreItemsList } from './utils/reportsAndCreateReport';

class Reports {
    @observable frameControls = {};
    @observable chartOptions = {};
    @observable.ref chartRef = {};

    @observable currentId = null;
    @observable loading = true;
    @observable.ref charts = groupAndPrepareCharts(exampleReportData);
    @observable chartsDataLoading = false;
    @observable currentCampaign = {};

    @action setFrameControlsExpand = ({ data, key }) => {
      set(this.frameControls, key, { isExpanded: data });
    }

    @action setFrameControlsErase = ({ data, key }) => {
      set(this.frameControls, key, { isErased: data });
    }

    @action onEraseFrameControls = () => {
      set(this.frameControls, {});
    }

    @action setChartsOptions = ({ data, key }) => {
      set(this.chartOptions, key, data);
    }

    getSavedChartsOptions = (id) => {
      return get(this.chartOptions, id);
    }

    getFrameControls = (id) => {
      return get(this.frameControls, id);
    }

    @action requestReportDataById = async (id) => {
      if (id === ORDER_EXAMPLE_ID) {
        this.charts = groupAndPrepareCharts(exampleReportData);
        return;
      }
      if (id === this.currentId || !id) return;
      this.chartsDataLoading = true;
      const response = await axiosAuthorizedRequest({
        url: '/api/v1/report/report_data/',
        params: { order: id },
      });
      runInAction(() => {
        this.charts = groupAndPrepareCharts(response);
        this.chartsDataLoading = false;
        this.currentId = id;
        return Promise.resolve();
      });
    }

    @computed get coreInfo() {
      return useReportCoreItemsList(this.charts);
    }

    @computed get coreInfoById() {
      const result = {};
      this.coreInfo.forEach((item) => {
        result[item.title] = item;
      });
      return result;
    }

    getCampaign = async (campaignId) => {
      return axiosAuthorizedRequest({
        url: getCampaignApiUrl(campaignId),
      });
    }

    @action setReportRef = (ref) => {
      this.chartRef = ref;
    }

    @action getCampaignById = async (id) => {
      if (id === CAMPAIGN_EXAMPLE_ID) {
        this.currentCampaign = exampleCampaignData;
      } else {
        const campaign = await this.getCampaign(id);
        runInAction(() => {
          this.currentCampaign = campaign;
        });
      }
      this.loading = false;
      return Promise.resolve();
    }

    orderFocusData = (campaignId) => {
      const campaignData = Object.keys(this.currentCampaign).length ? this.currentCampaign : exampleCampaignData;
      const focusOrder = campaignData.orders.find(order => order.channel_uid === CHANNEL_TYPE_FOCUS);
      const formattedTitle = campaignId === CAMPAIGN_EXAMPLE_ID ? campaignData.name : `Отчёт «${campaignData.name}»`;
      const formattedDateStart = focusOrder && formatDateBySplitter(focusOrder?.date_start || '');
      return {
        formattedDateStart,
        formattedTitle,
        quantityMin: focusOrder?.data?.quantityMin,
      };
    };
}

const ReportStore = new Reports();
export default ReportStore;
