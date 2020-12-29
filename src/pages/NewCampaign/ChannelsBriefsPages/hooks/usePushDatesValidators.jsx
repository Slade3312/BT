import { addDays, addMonths } from 'utils/date';
import { PUSH_DELTA_BETWEEN_DATES_IN_MONTHS, TWELVE_HOURS } from 'store/NewCampaign/channels/constants';
import NewCampaign from 'store/mobx/NewCampaign';

export const usePushDatesValidators = () => {
  const countMinStartDate = () => {
    const date = new Date();

    if (NewCampaign.orderDateStartOffset) {
      return addDays(date, NewCampaign.orderDateStartOffset);
    }
    return date.getHours() < TWELVE_HOURS ? date : addDays(date, 1);
  };

  const countMaxStartDate = (dateEnd) => {
    if (dateEnd) {
      const newDate = new Date(dateEnd);
      const minStartDate = countMinStartDate();

      if (newDate.getTime() < minStartDate.getTime()) {
        return minStartDate;
      }

      return newDate;
    }
    const date = new Date();

    if (date.getHours() < TWELVE_HOURS) {
      return addMonths(date, 1);
    }

    return addDays(addMonths(date, 1), 1);
  };

  const countMinEndDate = (dateStart) => {
    if (dateStart) {
      return new Date(dateStart);
    }
    return countMinStartDate();
  };

  const countMaxEndDate = (dateStart) => {
    const date = new Date(dateStart);

    if (dateStart) {
      const dateWithAdditionalMonths = addMonths(new Date(dateStart), PUSH_DELTA_BETWEEN_DATES_IN_MONTHS);

      if (date.getHours() < TWELVE_HOURS) {
        return dateWithAdditionalMonths;
      }
      return addDays(dateWithAdditionalMonths, 1);
    }
    return addMonths(countMaxStartDate(), PUSH_DELTA_BETWEEN_DATES_IN_MONTHS);
  };

  return {
    isInputsReadOnly: true,
    isEndDisabled: false,
    countMinStartDate,
    countMaxStartDate,
    countMinEndDate,
    countMaxEndDate,
    holidays: NewCampaign.ordersHolidays?.push,
  };
};
