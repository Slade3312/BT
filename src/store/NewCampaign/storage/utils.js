import { TAXON_KEYS } from 'store/constants';

export const modifyGeoPoints = (payload) => {
  const { job_geo, home_geo, weekend_geo, geoJob, geoHome, geoWeekEnd, ...otherPayload } = payload;
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

export const viewToDtoInternetOrderTools = tools =>
  (tools || []).filter(tool => tool.isActive).map(({ id, budget }) => ({ id, budget }));
