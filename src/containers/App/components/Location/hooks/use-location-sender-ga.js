import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNormalizedLocation } from 'hooks/use-normalized-location';
import { getLocationNameByUrl } from 'pages/utils';
import { FAQ_URL, NEW_CAMPAIGN_URL } from 'pages/constants';
import { pushPageViewLocationToGA } from 'utils/ga-analytics/utils';
import { normalizeEndOfUrl } from 'utils/router';
import { getActiveQuestionCategory } from 'store/Faq/selectors';
import { getCurrentCampaignId } from 'store/NewCampaign/storage/selectors';

export const useLocationSenderGA = () => {
  const location = useNormalizedLocation();
  const questionActiveCategory = useSelector(getActiveQuestionCategory);
  const currentCampaignId = useSelector(getCurrentCampaignId);

  useEffect(() => {
    const currentPageName = getLocationNameByUrl(window.location.pathname);
    // according GA business requirements
    if (location.pathname === FAQ_URL) {
      pushPageViewLocationToGA({ name: `${currentPageName}|${questionActiveCategory}` });
    } else if (location.pathname.indexOf(NEW_CAMPAIGN_URL) !== -1) {
      /* корретно определит текущий элемент если в конце урла есть символ "/" */
      let normalizedPathname = normalizeEndOfUrl(location.pathname);
      normalizedPathname = normalizedPathname.substring(0, normalizedPathname.length - 1);

      const lastPartOfPath = normalizedPathname.substring(
        normalizedPathname.lastIndexOf('/') + 1,
        normalizedPathname.length,
      );
      if (lastPartOfPath === String(currentCampaignId)) {
        pushPageViewLocationToGA({ name: `${currentPageName}` });
      } else {
        pushPageViewLocationToGA({ name: `${currentPageName}`, subName: `${lastPartOfPath}` });
      }
    } else {
      pushPageViewLocationToGA({ name: currentPageName });
    }
  }, [location, questionActiveCategory]);
};
