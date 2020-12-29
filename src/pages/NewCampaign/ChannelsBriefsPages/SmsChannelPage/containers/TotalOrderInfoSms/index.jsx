import React, { useCallback, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from '@reach/router';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { formatFloatWithComma, formatPrice, formatPriceWithLabel } from 'utils/formatting';
import { OrderSaveButton } from 'pages/NewCampaign/containers';
import { getSmsBriefFormOrder } from 'store/common/templates/newCampaign/briefs-selectors';
import { CHANNEL_STUB_SMS } from 'constants/index';
import { viewToDtoSmsChannel } from 'store/NewCampaign/storage/orders-view-to-dto';
import StartCampaignOrEditModal from 'components/modals/StartCampaignOrEditModal';
import TotalOrderInfo from 'pages/NewCampaign/ChannelsBriefsPages/components/TotalOrderInfo';
import { useSubmitOrderForm } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/use-submit-order';
import { useBaseChannelCalculatedInfo } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/use-base-channels-calculated-info';
import { getStartCampaignOrEditModal } from 'store/common/templates/newCampaign/selectors';
import { NEW_CAMPAIGN_URL } from 'pages/constants';
import { useStartCampaign } from 'pages/NewCampaign/hooks/use-start-campaign';
import PromocodeErrorModal from 'components/modals/PromocodeErrorModal';

function TotalOrderInfoSms({ emulatorText }) {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const content = useSelector(getStartCampaignOrEditModal);
  const { NewCampaign } = useContext(StoresContext);

  const { campaignId } = useParams();

  const anchorRef = useRef();

  const { total } = useSelector(getSmsBriefFormOrder);
  const navigate = useNavigate();

  const { avgEvents, maxEvents, minEvents, eventsCost, eventsName, budgetToDto }
  = useBaseChannelCalculatedInfo(CHANNEL_STUB_SMS);

  const calculateTotalCount = () => {
    if (avgEvents) {
      return `${formatPrice(avgEvents)} ${eventsName}`;
    }
    if (minEvents || maxEvents) {
      return `от ${formatPrice(minEvents)} до ${formatPrice(maxEvents)} ${eventsName}`;
    }
    return null;
  };

  const formattedBudget = formatPriceWithLabel(budgetToDto, total.budgetUnit);
  const formattedEventsCost = eventsCost && `${formatFloatWithComma(eventsCost)} ${total.costUnit}`;

  const handleIgnorePromocodeConfirm = useSubmitOrderForm({
    channelType: CHANNEL_STUB_SMS,
    viewToDtoConverter: viewToDtoSmsChannel,
    anchorRef,
    onAfterSave: () => {
      if (!NewCampaign.getCampaignTargetSmSOrder.is_editable || NewCampaign.currentCampaign.status_id === 5) {
        setIsModalOpened(true);
      } else navigate('/my-campaigns/');
    },
    customProps: {
      emulatorText,
      ignorePromocode: true,
    },
  });

  const onOrderSubmit = useSubmitOrderForm({
    channelType: CHANNEL_STUB_SMS,
    viewToDtoConverter: viewToDtoSmsChannel,
    anchorRef,
    onAfterSave: () => {
      if (!NewCampaign.getCampaignTargetSmSOrder.is_editable || NewCampaign.currentCampaign.status_id === 5) {
        setIsModalOpened(true);
      } else navigate('/my-campaigns/');
    },
    customProps: {
      emulatorText,
    },
  });

  const handleCloseModal = useCallback(
    () => {
      setIsModalOpened(false);
    },
    [],
  );

  const handleStartCampaign = useStartCampaign({
    onSetModalState: setIsModalOpened,
    onBeforeStart: () => {
      setIsLoading(true);
    },
    onAfterStart: () => {
      setIsLoading(false);
    },
  });

  return (
    <div ref={anchorRef}>
      <TotalOrderInfo
        isOnModeration={!NewCampaign.getCampaignTargetSmSOrder.is_editable && NewCampaign.currentCampaign.status_id !== 5}
        channelType={CHANNEL_STUB_SMS}
        totalCount={calculateTotalCount()}
        budget={formattedBudget}
        eventsCost={formattedEventsCost}
        perEventName={total.unitName}
        totalTitle={total.title}
        budgetTitle={total.budgetTitle}
        costTitle={total.costTitle}
        countName={total.countName}
      >
        <OrderSaveButton onClick={onOrderSubmit} isLight>
          {total.button}
        </OrderSaveButton>
      </TotalOrderInfo>

      {NewCampaign.promocodeError && (
        <PromocodeErrorModal
          description={NewCampaign.promocodeError}
          onConfirm={handleIgnorePromocodeConfirm}
          onClose={() => NewCampaign.set('promocodeError', '')}
        />
      )}

      {isModalOpened && (
        <StartCampaignOrEditModal
          onClose={handleCloseModal}
          channelType={CHANNEL_STUB_SMS}
          onEditContinue={() => {
            navigate(`${NEW_CAMPAIGN_URL}${campaignId}/channels`);
          }}
          onCampaignStart={handleStartCampaign}
          isLoading={isLoading}
          content={content}
        />
      )}
    </div>
  );
}

TotalOrderInfoSms.propTypes = {
  emulatorText: PropTypes.string,
};

export default observer(TotalOrderInfoSms);
