import { getMonthName, getWeekDayName } from 'utils/date';

export const getFormattedNewDate = () => {
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = getMonthName(currentDate.getMonth());
  const year = currentDate.getFullYear();
  const weekDay = getWeekDayName(currentDate.getDay());

  return `${day} ${month} ${year}, ${weekDay}`;
};
