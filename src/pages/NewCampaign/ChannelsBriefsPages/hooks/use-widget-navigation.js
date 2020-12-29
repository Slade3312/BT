import { useNavigate } from '@reach/router';
import { useSelector } from 'react-redux';
import { pushBannerClickCardToGA } from 'utils/ga-analytics/utils';
import { getWidgetsCardById, getWidgetsCardTitle } from 'store/common/templates/newCampaign/selectors';

export const useWidgetNavigation = (channelType) => {
  const widget = useSelector(getWidgetsCardById)[channelType];
  const title = getWidgetsCardTitle(widget);

  const navigate = useNavigate();

  return () => {
    navigate(`channels/${channelType}`);
    pushBannerClickCardToGA({ title });
  };
};
