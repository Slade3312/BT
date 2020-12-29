import { useCallback, useEffect, useState } from 'react';
import { useForm, useFormState } from 'react-final-form';
import { useDispatch } from 'react-redux';
import { useScrollToInvalid } from 'hooks/use-scroll-to-invalid';
import { setCampaignLoader } from 'store/NewCampaign/campaign/actions';
import { setOrderIsEmpty } from 'store/NewCampaign/storage/actions';
import Social from 'store/mobx/Social';
import { CHANNEL_STUB_TARGET_INTERNET } from 'constants/index';
import { pushDraftSaveErrorToGA } from 'utils/ga-analytics/utils';
import { STEP_SLUG_CHANNELS } from 'store/NewCampaign/constants';
import { useSaveCampaignOrder } from './use-save-campaign-order';

const afterSaveAction = (response, channelType) => dispatch => {
  const { is_empty: isEmpty } = response;
  if (channelType === CHANNEL_STUB_TARGET_INTERNET) {
    Social.adStep.isEmpty = isEmpty;
  } else {
    dispatch(setOrderIsEmpty(channelType, isEmpty));
  }
};

export const useSubmitOrderForm = ({ channelType, viewToDtoConverter, anchorRef, onAfterSave, onBeforeSave, formId, customProps }) => {
  const [anchorNode, setAnchorNode] = useState(null);

  const dispatch = useDispatch();

  const onScroll = useScrollToInvalid(anchorNode);

  const { valid } = useFormState();
  const { submit } = useForm();

  const handleSave = useSaveCampaignOrder({
    channelType,
    viewToDtoConverter,
    customProps,
  });

  useEffect(() => {
    const formNode = anchorRef?.current ?? document.forms[formId];
    setAnchorNode(formNode);
  }, []);

  return useCallback(async () => {
    if (valid) {
      try {
        if (onBeforeSave) {
          onBeforeSave();
        }

        dispatch(setCampaignLoader(channelType, true));
        const response = await handleSave();

        // temporary it works like MobX or Redux inside
        dispatch(afterSaveAction(response, channelType));

        submit();

        onAfterSave();
      } catch (e) {
        pushDraftSaveErrorToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: channelType });
      } finally {
        dispatch(setCampaignLoader(channelType, false));
      }
    } else {
      submit();
      onScroll();
    }
  }, [valid, handleSave, anchorNode, onAfterSave, onBeforeSave, submit]);
};
