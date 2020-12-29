import { createDebouncedGA, pushToGA } from './data-layer';

export const getStepNameGA = ({ slugTitle, subSlugTitle }) =>
  (slugTitle && !subSlugTitle ? slugTitle : `${slugTitle}|${subSlugTitle}`);

// use for entire banner (if a whole banner is clickable)
export const pushBannerClickCardToGA = data =>
  pushToGA({
    event: 'event_b2b',
    eventCategory: 'BannerClickCard',
    eventAction: data.title,
    eventLabel: window.location.pathname,
  });

// main navigation menu click
export const pushMainNavClickToGA = ({ pageTitle }) =>
  pushToGA({
    event: 'event_b2b',
    eventCategory: 'MainNav',
    eventAction: pageTitle,
    eventLabel: window.location.pathname,
  });

// top header navigation menu click
export const pushTopNavClickToGA = ({ slugTitle, subSlugTitle }) =>
  pushToGA({
    event: 'event_b2b',
    eventCategory: 'TopNav',
    eventAction: getStepNameGA({ slugTitle, subSlugTitle }),
    eventLabel: window.location.pathname,
  });

const pushChangeLocationToGADebounced = createDebouncedGA(100);

export const pushPageViewLocationToGA = ({ name, subName }) =>
  pushChangeLocationToGADebounced({
    event: 'event_b2b_item_pageview',
    title: getStepNameGA({ slugTitle: name, subSlugTitle: subName }),
  });

// top header navigation menu click
export const pushSocialLinkClickToGA = ({ name }) =>
  pushToGA({
    event: 'event_b2b_social_networks',
    blockName: name,
    action: 'click',
    elementLocation: 'BottomNav',
  });

const pushDraftSaveSuccessToGADebounced = createDebouncedGA(2000);
const pushDraftSaveErrorToGADebounced = createDebouncedGA(2000);

export const pushDraftSaveSuccessToGA = ({ slugTitle, subSlugTitle }) =>
  pushDraftSaveSuccessToGADebounced({
    event: 'event_b2b_marketEco_brief',
    action: 'save_brief_success',
    title: getStepNameGA({ slugTitle, subSlugTitle }),
  });

export const pushDraftSaveErrorToGA = ({ slugTitle, subSlugTitle }) =>
  pushDraftSaveErrorToGADebounced({
    event: 'event_b2b_marketEco_brief',
    action: 'save_brief_error',
    title: getStepNameGA({ slugTitle, subSlugTitle }),
  });

export const pushOrderSaveSuccessToGA = ({ orderId, campaignId, slugTitle, subSlugTitle }) =>
  pushToGA({
    event: 'event_b2b_order',
    action: 'order_success',
    b2b_campaign_id: campaignId,
    b2b_order_id: orderId,
    title: getStepNameGA({ slugTitle, subSlugTitle }),
  });

export const pushOrderSaveErrorToGA = ({ orderId, campaignId, slugTitle, subSlugTitle }) =>
  pushToGA({
    event: 'event_b2b_order',
    action: 'order_error',
    b2b_campaign_id: campaignId,
    b2b_order_id: orderId,
    title: getStepNameGA({ slugTitle, subSlugTitle }),
  });
