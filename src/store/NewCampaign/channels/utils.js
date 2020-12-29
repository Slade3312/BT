import { throwNonBlockingError } from 'utils/errors';
import {
  CHANNEL_STUB_INTERNET,
  CHANNEL_STUB_PUSH,
  CHANNEL_STUB_SMS,
  CHANNEL_STUB_TARGET_INTERNET,
  CHANNEL_STUB_VOICE,
} from '../../../constants';

// TODO remove it after task with "load all templates from back-end" will be completed
const getChannelDataByUid = (channelUid) => {
  switch (channelUid) {
    case CHANNEL_STUB_INTERNET:
      return {
        launchDateTitleHtml: 'Период запуска кампании',
      };
    case CHANNEL_STUB_VOICE:
      return {
        launchDateTitleHtml: 'Период обзвона клиентов',
      };
    case CHANNEL_STUB_SMS:
      return {
        launchDateTitleHtml: 'Период рассылки и настройки времени отправки SMS',
      };
    case CHANNEL_STUB_PUSH:
      return {
        launchDateTitleHtml: 'Период рассылки уведомлений',
      };
    case CHANNEL_STUB_TARGET_INTERNET:
      return {};
    default:
      throwNonBlockingError(`Unknown channel uid ${channelUid}`);
      return {};
  }
};

export const convertLegacyChannel = ({ channel_uid: channelUid, ...channel }) => ({
  channel_uid: channelUid,
  channel_type_id: channel.channel_type_id,
  id: channel.id,
  name: channel.name,
  description: channel.description,
  minimal_budget: channel.minimal_budget,
  tariff: channel.tariff,
  ...getChannelDataByUid(channelUid),
});
