import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from '@reach/router';
import { usePrevious } from 'hooks/use-previous';
import { pushNotification } from 'store/notifications/actions';
import { SET_CAMPAIGN_NOTIFICATION_DATA } from 'store/notifications/constants';
import { StoresContext } from 'store/mobx';
import { useLocationScrollController, useLocationSenderGA } from '../Location/hooks';

// on this stage local store must be already initialized with global fetched data
function AppGlobalSubscriber({ children }) {
  const { NewCampaign } = useContext(StoresContext);
  const location = useLocation();

  const hasCampaignId = Boolean(location.pathname.split('/')[2]);
  const prevHasCampaignId = usePrevious(hasCampaignId);
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      NewCampaign.isCampaignInDraft &&
      location.hash !== '#success-start' &&
      prevHasCampaignId !== hasCampaignId &&
      hasCampaignId === false &&
      prevHasCampaignId === true
    ) {
      dispatch(pushNotification(SET_CAMPAIGN_NOTIFICATION_DATA));
    }
  }, [prevHasCampaignId, hasCampaignId, location.hash]);

  useLocationScrollController();
  useLocationSenderGA();

  return children;
}

AppGlobalSubscriber.propTypes = {
  children: PropTypes.node,
};

export default observer(AppGlobalSubscriber);
