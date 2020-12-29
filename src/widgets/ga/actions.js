import { pushToGA } from 'utils/ga-analytics/data-layer';
import { getFeedbackBannerTitle } from 'store/common/templates/common/selectors';

export const pushShowQuestionBlockGA = () => (_, getState) => {
  pushToGA({
    event: 'event_b2b_question',
    action: 'show_block',
    blockName: getFeedbackBannerTitle(getState()),
  });
};

export const pushShowQuestionPopupGA = () => (_, getState) =>
  pushToGA({
    event: 'event_b2b_question',
    action: 'show_popup',
    blockName: getFeedbackBannerTitle(getState()),
  });

