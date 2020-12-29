const getSettings = state => state.settings || {};

export const getHolidays = state => getSettings(state).holidays || {};
