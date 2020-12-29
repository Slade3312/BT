import { wordFormByCount } from 'utils/fn';
import { TAXON_KEYS } from 'store/constants';
import NewCampaign from 'store/mobx/NewCampaign';

export const convertEmulatorMessage = (message) => {
  const messageText = message && message.text;
  const messageLinks = message?.links || [];
  if (messageText) {
    const divided = messageText.split(' ');
    const updatedMap = divided.map(item => {
      let arr = item.split('\n');
      if (arr.length > 1) {
        arr = arr.map((word, index) => {
          if (index > 0) {
            return `\n${word}`;
          }
          return word;
        });
      }
      return arr;
    });
    const prepared = updatedMap.flat().map((text) => {
      const neededMessage = messageLinks.find(link => link.link === text.replace('\n', '') && link.isShort);
      if (messageLinks && neededMessage) {
        return neededMessage.shortLink;
      }
      return text;
    });
    return prepared.join(' ');
  }
  return undefined;
};

export const getEventsInfo = ({ qty_min, qty_max }, eventsForms) =>
  qty_min && qty_max && `от ${qty_min} до ${qty_max} ${wordFormByCount(Math.floor(qty_max), eventsForms)}`;

export const modifyGeoPoints = (payload) => {
  const { job_geo, home_geo, weekend_geo, ...otherPayload } = payload;
  switch (otherPayload.geo_type) {
    case TAXON_KEYS.JOB_GEO:
      return {
        ...otherPayload,
        [TAXON_KEYS.JOB_GEO]: otherPayload.geo_points,
      };
    case TAXON_KEYS.HOME_GEO:
      return {
        ...otherPayload,
        [TAXON_KEYS.HOME_GEO]: otherPayload.geo_points,
      };
    case TAXON_KEYS.WEEKEND_GEO:
      return {
        ...otherPayload,
        [TAXON_KEYS.WEEKEND_GEO]: otherPayload.geo_points,
      };
    default:
      return {
        ...otherPayload,
        [TAXON_KEYS.JOB_GEO]: otherPayload.geo_points,
        [TAXON_KEYS.HOME_GEO]: otherPayload.geo_points,
        [TAXON_KEYS.WEEKEND_GEO]: otherPayload.geo_points,
      };
  }
};
