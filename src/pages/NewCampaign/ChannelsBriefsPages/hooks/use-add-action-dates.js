import { addDays, addMonths } from 'utils/date';
import Common from 'store/mobx/Common';
import { CHANNEL_STUB_TARGET_INTERNET } from 'constants/index.js';

const MAX_AVAILABLE_MONTHS = 99;

const useSocialDatesValidators = () => {
  const { real_offset } = Common.getChannelInfoByUid(CHANNEL_STUB_TARGET_INTERNET);
  const countMinStartDate = () => {
    // because of backend and technical task
    return addDays(new Date(), real_offset + 1);
  };

  const countMaxStartDate = (dateEnd) => {
    if (dateEnd) {
      const newDate = new Date(dateEnd);
      newDate.setDate(newDate.getDate());

      return newDate;
    }
    return addMonths(new Date(), MAX_AVAILABLE_MONTHS);
  };

  const countMinEndDate = (dateStart) => {
    if (dateStart) {
      return addDays(new Date(dateStart));
    }
    return addDays(countMinStartDate());
  };

  const countMaxEndDate = () => addMonths(new Date(), MAX_AVAILABLE_MONTHS);
  return {
    isEndDisabled: true,
    countMinStartDate,
    countMaxStartDate,
    countMinEndDate,
    countMaxEndDate,
  };
};

export default useSocialDatesValidators;
