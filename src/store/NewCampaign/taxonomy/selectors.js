import { getNewCampaignData } from '../../selectors';

export const __getTaxonsData = state => getNewCampaignData(state).taxons;
