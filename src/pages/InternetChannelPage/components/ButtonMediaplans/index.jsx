import React, { useContext } from 'react';
import { useForm, useFormState } from 'react-final-form';
import PropTypes from 'prop-types';
import { useParams } from '@reach/router';
import { observer } from 'mobx-react';
import { ActionButton } from 'components/buttons/ActionButtons';
import { postSendInternetBrief, putOrderRequest } from 'requests/campaigns';
import { ORDER_ADD_INFO_FIELD, ORDER_CHOSEN_TARIFF, ORDER_DATE, ORDER_FINISH_DATE_FIELD, ORDER_INDUSTRY_FIELD, ORDER_IS_OVERDUE_TARIFFS, ORDER_MOBILE_VERSION, ORDER_START_DATE_FIELD, ORDER_TARIFFS, ORDER_TOOLS_FIELD, ORDER_URL_ADVERTISER_FIELD } from 'store/NewCampaign/channels/constants';
import { scrollSmoothToNodeById } from 'utils/scroll';
import { TARIFF_CARDS_NODE_ID } from 'pages/NewCampaign/constants';
import { CHANNEL_STUB_INTERNET } from 'constants/index';
import { StoresContext } from 'store/mobx';
import { viewToDtoInternetOrderTools } from 'store/NewCampaign/storage/utils';
import styles from './styles.pcss';

const ButtonMediaplans = ({ onSetLoading, isLoading }) => {
  const { NewCampaign } = useContext(StoresContext);
  const { change } = useForm();
  const {
    errors: { chosenTariff, ...toDisabledButtonErrors },
  } = useFormState();

  const { campaignId } = useParams();

  const handlePreSaveInternetOrder = async () => {
    try {
      await putOrderRequest({
        campaignId: NewCampaign.currentCampaign.id,
        channelType: CHANNEL_STUB_INTERNET,
        data: {
          [ORDER_START_DATE_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_DATE] && NewCampaign.currentCampaign.currentOrder[ORDER_DATE][0],
          [ORDER_FINISH_DATE_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_DATE] && NewCampaign.currentCampaign.currentOrder[ORDER_DATE][1],
          data: {
            [ORDER_TOOLS_FIELD]: viewToDtoInternetOrderTools(NewCampaign.currentCampaign.currentOrder[ORDER_TOOLS_FIELD]),
            [ORDER_CHOSEN_TARIFF]: NewCampaign.currentCampaign.currentOrder[ORDER_CHOSEN_TARIFF],
            [ORDER_INDUSTRY_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_INDUSTRY_FIELD],
            [ORDER_URL_ADVERTISER_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_URL_ADVERTISER_FIELD],
            [ORDER_ADD_INFO_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_ADD_INFO_FIELD],
            [ORDER_MOBILE_VERSION]: NewCampaign.currentCampaign.currentOrder[ORDER_MOBILE_VERSION],
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
  };
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
