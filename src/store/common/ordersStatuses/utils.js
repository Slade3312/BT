import { orderStatusesTranslateMap } from './constants';

export const getTranslatedOrderStatusById = (statusId, label) => orderStatusesTranslateMap[statusId] || label;
