import { getNewCampaignData } from '../../selectors';

export const getCampaign = state => getNewCampaignData(state).campaign;

export const getCampaignLoaders = state => getCampaign(state).loaders;

export const getCampaignPromocodeData = state => getCampaign(state).promocodeData;
