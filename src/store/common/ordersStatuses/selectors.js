import { getTranslatedOrderStatusById } from './utils';

export const getOrderStatusesOptions = list => list.map(item => ({ label: getTranslatedOrderStatusById(item.id, item.label), value: item.id }));
