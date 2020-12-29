import { FIELD_ORDER_STATUS, FIELD_STATUS, FILTER_STATUS_PREFIXES } from './constants';

export const getPreparedFilterStatusParams = (status) => {
  const statusParts = status.split(':');
  const statusPrefix = statusParts[0];
  const statusValue = statusParts[1];
  switch (statusPrefix) {
    case FILTER_STATUS_PREFIXES.CAMPAIGN: {
      return { [FIELD_STATUS]: statusValue };
    }
    case FILTER_STATUS_PREFIXES.ORDER: {
      return { [FIELD_ORDER_STATUS]: statusValue };
    }
    default:
      throw new Error('failed status key when send campaign filters');
  }
};
