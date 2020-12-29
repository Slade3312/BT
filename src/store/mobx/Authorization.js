import { observable, action, runInAction, computed } from 'mobx';
import axios from 'axios';

class Authorization {
    @observable isLoggedIn = true;
    @observable timeLeft = 0;
    @observable screen = 'phone';
    @observable isErrorPhone = false
    @observable phone = '';


    @action setErrorPhone = value => {
      this.isErrorPhone = value;
    }

    @action resetError = () => {
      this.setErrorPhone(false);
    }

    @action setScreen = (screen = 'phone') => {
      this.screen = screen;
    }

    @action setPhone = phone => {
      this.phone = phone;
    }

    phoneConfirmation = async ({ phone, code }) => {
      const formData = new FormData();
      formData.append('phone', encodeURIComponent(`+${phone}`));
      if (code) {
        formData.append('code', code);
      }
      try {
        const response = await axios({
          url: '/api/v1/phone_confirmation/',
          method: 'POST',
          data: formData,
        });
        if (response?.data?.time_left) {
          runInAction(() => { this.timeLeft = response.data.time_left; });
        }
      } catch (e) {
        if (e?.response?.status === 400 && e?.response?.data?.time_left && !code) {
          runInAction(() => { this.timeLeft = e.response.data.time_left; });
          runInAction(() => { this.screen = 'sms'; });
          return;
        }
        throw e;
      }
    };

    @action setUnauthorized = () => {
      this.isLoggedIn = false;
    }

    @computed get checkIsPhoneCorrect() {
      const clearedPhone = this.phone.replace(/\D/g, '');
      if (clearedPhone[0] !== '7' || clearedPhone[1] !== '9' || clearedPhone.length !== 11) return false;
      return true;
    }
}

const authorizationStore = new Authorization();
export default authorizationStore;
