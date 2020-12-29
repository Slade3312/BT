import { CHANNEL_TYPE_FOCUS } from 'pages/AudienceStatistic/constants';

export const findByFocusOrders = orders => orders.find(order => order.channel_uid === CHANNEL_TYPE_FOCUS);
