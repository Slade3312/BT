import { addDays, addMonths } from 'utils/date';
import Social from 'store/mobx/Social';
import NewCampaign from 'store/mobx/NewCampaign';

const MAX_AVAILABLE_MONTHS = 99;

const useSocialDatesValidators = () => {
  const countMinStartDate = () => {
    return addDays(new Date(), 8);
  };

  const countMaxStartDate = (dateEnd) => {
    if (dateEnd) {
      const newDate = new Date(dateEnd);
      newDate.setDate(newDate.getDate() - Social.getChoosenTariffDuration);

      return newDate;
    }
    return addMonths(new Date(), MAX_AVAILABLE_MONTHS);
  };

  const countMinEndDate = (dateStart) => {
    if (dateStart) {
      return addDays(new Date(dateStart), Social.getChoosenTariffDuration);
    }
    return addDays(countMinStartDate(), Social.getChoosenTariffDuration);
  };

  const countMaxEndDate = () => addMonths(new Date(), MAX_AVAILABLE_MONTHS);

  return {
    isEndDisabled: true,
    countMinStartDate,
    countMaxStartDate,
    countMinEndDate,
    countMaxEndDate,
    holidays: NewCampaign.ordersHolidays?.social,
  };
};

export default useSocialDatesValidators;
