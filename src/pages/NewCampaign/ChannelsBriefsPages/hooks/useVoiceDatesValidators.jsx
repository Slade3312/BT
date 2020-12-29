import Common from 'store/mobx/Common';
import { addDays, addMonths } from 'utils/date';
import NewCampaign from 'store/mobx/NewCampaign';

import { CHANNEL_STUB_VOICE } from '../../../../constants';

const MAX_AVAILABLE_MONTHS = 99;
const MIN_OFFSET_BETWEEN_DATES = 1;

export const useVoiceDatesValidators = () => {
  const { real_offset } = Common.getChannelInfoByUid(CHANNEL_STUB_VOICE);

  const countMinStartDate = () => {
    // because of backend and technical task
    return addDays(new Date(), real_offset + 1);
  };

  const countMaxStartDate = (dateEnd) => {
    if (dateEnd) {
      const newDate = new Date(dateEnd);
      newDate.setDate(newDate.getDate() - MIN_OFFSET_BETWEEN_DATES);
      const minStartDate = countMinStartDate();

      if (newDate.getTime() < minStartDate.getTime()) {
        return minStartDate;
      }
      return newDate;
    }
    return addMonths(new Date(), MAX_AVAILABLE_MONTHS);
  };

  const countMinEndDate = (dateStart) => {
    if (dateStart) {
      return addDays(new Date(dateStart), MIN_OFFSET_BETWEEN_DATES);
    }
    return addDays(countMinStartDate(), MIN_OFFSET_BETWEEN_DATES);
  };

  const countMaxEndDate = () => {
    return addMonths(new Date(), MAX_AVAILABLE_MONTHS);
  };

  return {
    countMinStartDate,
    countMaxStartDate,
    countMinEndDate,
    countMaxEndDate,
    isWeekendDisabled: true,
    holidays: NewCampaign.ordersHolidays?.voice,
  };
};
