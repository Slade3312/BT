import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  offPushAudienceRestriction,
  syncPushAudience,
} from 'store/NewCampaign/storage/actions';
import { getPushSelectionIsActive } from 'store/NewCampaign/controls/selectors';
import { PUSH_TARGET_ACTIONS } from '../../../constants';

export const useRestrictedAudience = (targetAction) => {
  const dispatch = useDispatch();
  const syncRestrictedAudience = useCallback(() => dispatch(syncPushAudience()), [dispatch]);
  const restrictionExit = useCallback(() => dispatch(offPushAudienceRestriction()), [dispatch]);

  const isPushActive = useSelector(getPushSelectionIsActive);

  useEffect(() => {
    if (!isPushActive && targetAction === PUSH_TARGET_ACTIONS.APP_DOWNLOAD) {
      syncRestrictedAudience();
    }

    return () => {
      restrictionExit();
    };
  }, [syncRestrictedAudience, restrictionExit, targetAction]);

  return () => {
    if (targetAction === PUSH_TARGET_ACTIONS.APP_DOWNLOAD) {
      restrictionExit();
    }
  };
};
