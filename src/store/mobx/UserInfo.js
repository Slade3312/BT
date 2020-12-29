import { observable, computed, runInAction, action } from 'mobx';
import { viewToDto, mutateUserInfoRequest } from 'requests/user-info';
import { USER_INFO_URL } from 'pages/constants';
import { axiosAuthorizedRequest, composeErrorCatchingRequest } from 'requests/helpers';
import Common from './Common';
import { getUserInfoData, getUserInfoCompany } from './Normalize';


class UserInfo {
  constructor() {
    this.getUserInfoData = getUserInfoData.bind(this);
    this.getUserInfoCompany = getUserInfoCompany.bind(this);
  }
    @observable data = null;
    @observable isEditable = false;
    @observable isLoading = true;

    @action set = (value, data) => {
      this[value] = data;
    };

    getUser = async (force = false) => {
      if (this.data && !force) {
        return;
      }

      const response = await composeErrorCatchingRequest(axiosAuthorizedRequest)({ url: `/api/v1${USER_INFO_URL}` });

      runInAction(() => {
        this.data = response;
      });
    };

    @action updateUser = async () => {
      try {
        await mutateUserInfoRequest(viewToDto(this.data));
        return true;
      } catch (e) {
        throw e.response.data;
      } finally {
        runInAction(() => {
          this.isEditable = false;
        });
      }
    };

    @computed get username() {
      return this?.data?.username || undefined;
    }

    @computed get selectedIndustryLabel() {
      if (Common?.industries.length && this.data?.company?.industry) {
        const industry = Common.industries.filter(item => item.value === this.data?.company?.industry)[0];
        return industry.label;
      }
      return '';
    }
}

const userInfoStore = new UserInfo();
export default userInfoStore;
