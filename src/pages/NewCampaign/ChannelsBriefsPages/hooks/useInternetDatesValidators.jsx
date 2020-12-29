import { addDays, addMonths } from 'utils/date';
import Common from 'store/mobx/Common';
import { CHANNEL_STUB_INTERNET } from 'constants/index.js';
import NewCampaign from 'store/mobx/NewCampaign';

const MAX_AVAILABLE_MONTHS = 99;
const OFFSET_BETWEEN_DATES = 30;

export const useInternetDatesValidators = () => {
  const { real_offset } = Common.getChannelInfoByUid(CHANNEL_STUB_INTERNET);

  const countMinStartDate = () => {
    // because of backend and technical task
    return addDays(new Date(), real_offset + 1);
  };

  const countMaxStartDate = (dateEnd) => {
    if (dateEnd) {
      const newDate = new Date(dateEnd);
      newDate.setDate(newDate.getDate() - OFFSET_BETWEEN_DATES);

      return newDate;
    }
    return addMonths(new Date(), MAX_AVAILABLE_MONTHS);
  };

  const countMinEndDate = (dateStart) => {
    if (dateStart) {
      return addDays(new Date(dateStart), OFFSET_BETWEEN_DATES);
    }
    return addDays(countMinStartDate(), OFFSET_BETWEEN_DATES);
  };

  const countMaxEndDate = () => addMonths(new Date(), MAX_AVAILABLE_MONTHS);

  return {
    isWeekendDisabled: true,
    isEndDisabled: true,
    countMinStartDate,
    countMaxStartDate,
    countMinEndDate,
    countMaxEndDate,
    holidays: NewCampaign.ordersHolidays?.internet,
  };
};
