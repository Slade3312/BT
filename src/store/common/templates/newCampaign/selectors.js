import { createSelector } from 'reselect';
import { convertListToObjectBy } from 'utils/fn';
import { getChannelsListMap } from 'store/NewCampaign/selectors';
import { getTemplatesNewCampaign } from '../selectors';
import { deepTemplateTransformByContentType } from '../utils';

const getTemplateNewCampaignTransformed = createSelector(
  getTemplatesNewCampaign,
  deepTemplateTransformByContentType,
);

const getSidebar = state => getTemplateNewCampaignTransformed(state).Sidebar;
export const getSidebarTitle = state => getSidebar(state)?.title;

const getCampaignTotalBlock = state => getTemplateNewCampaignTransformed(state).CampaignTotalBlock;
export const getCampaignTotalBlockTitle = state => getCampaignTotalBlock(state).title;
export const getCampaignTotalBlockDescription = state => getCampaignTotalBlock(state).description;

// we should't change slug names on back-end side. Slug = url of LeftMenu
export const getCampaignCommonStep = state => ({
  ...getTemplateNewCampaignTransformed(state).CampaignCommonStep,
  slug: 'name',
});
export const getCampaignTaxonsStep = state => ({
  ...getTemplateNewCampaignTransformed(state).CampaignTaxonsStep,
  slug: 'audience',
});
export const getCampaignAudienceStep = state => ({
  ...getTemplateNewCampaignTransformed(state).CampaignAudienceStep,
  slug: 'channels',
});

// step channels
const getStepChannelsContent = state => getTemplateNewCampaignTransformed(state).StepChannelsContent;
export const getStepChannelsContentStartButtonText = state => getStepChannelsContent(state)?.startButtonText;

export const getWidgetsTemplatesItems = state => getStepChannelsContent(state)?.widgetsCards?.items;

export const getChannelsWidgetsCardsItems = createSelector(
  getChannelsListMap,
  getWidgetsTemplatesItems,
  (channelsData, templatesItems) => templatesItems.map(item => ({
    ...channelsData[item.channel_uid],
    ...item,
  })),
);

export const getChannelsWidgetsCardsItemsByIds = createSelector(
  getChannelsWidgetsCardsItems,
  convertListToObjectBy('channel_uid'),
);

export const getCampaignSuccessPopup = state => getTemplateNewCampaignTransformed(state).CampaignSuccessPopup;
export const getStartCampaignOrEditModal = state => getTemplateNewCampaignTransformed(state).StartCampaignOrEditModal;
export const getGeneralStartCampaignModal = state => getTemplateNewCampaignTransformed(state).GeneralStartCampaignModal;

export const getCampaignEmptySelectionPopup = state => getTemplateNewCampaignTransformed(state).EmptySelectionPopup;

export const getWidgetsCardById = id => state => getChannelsWidgetsCardsItemsByIds(state)[id];

export const getWidgetsCardTitle = widgetsCard => widgetsCard?.title;
export const getWidgetsCardTariffInfo = widgetsCard => widgetsCard?.tariffInfo;
export const getWidgetsCardTariffLinkText = widgetsCard => widgetsCard?.tariffLinkText;
export const getWidgetsCardTariffLinkUrl = widgetsCard => widgetsCard?.tariffLinkUrl;
export const getWidgetsEditButtonText = widgetsCard => widgetsCard?.editBriefButton;
export const getWidgetsButtonText = widgetsCard => widgetsCard?.buttonText;
export const getWidgetsEventsTextIcon = widgetsCard => widgetsCard?.eventsTextIcon;
export const getWidgetsDefaultEvents = widgetsCard => widgetsCard?.defaultEvents;
