import { SET_HOLIDAYS_SETTINGS } from './constants';

const mutateHolidays = (holidays) => {
  const holydaysDataSet = {};

  holidays.forEach((item) => {
    holydaysDataSet[item.date] = true;
  });

  return holydaysDataSet;
};

export const setHolidaySettings = holidays => ({
  type: SET_HOLIDAYS_SETTINGS,
  payload: mutateHolidays(holidays),
});
