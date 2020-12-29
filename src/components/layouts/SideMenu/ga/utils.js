import { pushToGA } from 'utils/ga-analytics/data-layer';
import { getStepNameGA } from 'utils/ga-analytics/utils';

// TODO make/or pass russian slug names
export const pushClickLeftNavToGA = ({ slugTitle, subSlugTitle }) =>
  pushToGA({
    event: 'event_b2b',
    eventCategory: 'LeftNav',
    eventAction: getStepNameGA({ slugTitle, subSlugTitle }),
    eventLabel: window.location.pathname,
  });
