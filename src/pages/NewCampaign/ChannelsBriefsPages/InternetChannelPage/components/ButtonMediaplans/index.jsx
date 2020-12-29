import React from 'react';
import { useForm, useFormState } from 'react-final-form';
import PropTypes from 'prop-types';
import { useParams } from '@reach/router';
import { observer } from 'mobx-react';
import { ActionButton } from 'components/buttons/ActionButtons';
import { postSendInternetBrief } from 'requests/campaigns';
import { ORDER_IS_OVERDUE_TARIFFS, ORDER_TARIFFS } from 'store/NewCampaign/channels/constants';
import { scrollSmoothToNodeById } from 'utils/scroll';
import {
  viewToDtoInternetChannelForMediaplans,
} from 'store/NewCampaign/storage/orders-view-to-dto';
import { TARIFF_CARDS_NODE_ID } from 'pages/NewCampaign/constants';
import { CHANNEL_STUB_INTERNET } from 'constants/index';
import { useSaveCampaignOrder } from '../../../hooks/use-save-campaign-order';
import styles from './styles.pcss';

const ButtonMediaplans = ({ onSetLoading, isLoading }) => {
  const { change } = useForm();
  const {
    errors: { chosenTariff, ...toDisabledButtonErrors },
  } = useFormState();

  const { campaignId } = useParams();

  const handlePreSaveInternetOrder = useSaveCampaignOrder({
    channelType: CHANNEL_STUB_INTERNET,
    viewToDtoConverter: viewToDtoInternetChannelForMediaplans,
    customProps: {},
  });
  const isValidForm = Object.keys(toDisabledButtonErrors).length === 0;

  const handleSyncMediaplans = async () => {
    onSetLoading(true);
    scrollSmoothToNodeById(TARIFF_CARDS_NODE_ID);

    try {
      await handlePreSaveInternetOrder();
      const tariffs = await postSendInternetBrief(campaignId);

      change(ORDER_TARIFFS, tariffs);
      change(ORDER_IS_OVERDUE_TARIFFS, false);
    } finally {
      onSetLoading(false);
    }
  };

  return (
    <div className={styles.component}>
      <ActionButton
        onClick={handleSyncMediaplans}
        isDisabled={isLoading || !isValidForm}
        className={styles.button}
        type="button"
      >
        Получить медиаплан
      </ActionButton>
    </div>
  );
};

ButtonMediaplans.propTypes = {
  onSetLoading: PropTypes.func,
  isLoading: PropTypes.bool,
};

export default observer(ButtonMediaplans);
