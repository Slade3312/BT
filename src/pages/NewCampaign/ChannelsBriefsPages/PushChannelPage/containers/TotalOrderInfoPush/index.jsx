import React, { useCallback, useContext, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from '@reach/router';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { formatFloatWithComma, formatPrice, formatPriceWithLabel } from 'utils/formatting';
import { viewToDtoPushChannel } from 'store/NewCampaign/storage/orders-view-to-dto';
import { CHANNEL_STUB_PUSH } from 'constants/index';
import { NEW_CAMPAIGN_URL } from 'pages/constants';
import { OrderSaveButton } from 'pages/NewCampaign/containers';
import StartCampaignOrEditModal from 'components/modals/StartCampaignOrEditModal';
import TotalOrderInfo from 'pages/NewCampaign/ChannelsBriefsPages/components/TotalOrderInfo';
import { useSubmitOrderForm } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/use-submit-order';
import { useBaseChannelCalculatedInfo } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/use-base-channels-calculated-info';
import { useNormalizedPushFields } from 'pages/NewCampaign/ChannelsBriefsPages/PushChannelPage/containers/PushOrderFormBody/hooks/use-normalized-push-fields.js';
import { getStartCampaignOrEditModal } from 'store/common/templates/newCampaign/selectors';
import { useStartCampaign } from 'pages/NewCampaign/hooks/use-start-campaign';

function TotalOrderInfoPush() {
  const { NewCampaign } = useContext(StoresContext);

  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const content = useSelector(getStartCampaignOrEditModal);

  const { campaignId } = useParams();

  const anchorRef = useRef();

  const { avgEvents, maxEvents, minEvents, eventsCost, eventsName, budgetToDto }
  = useBaseChannelCalculatedInfo(CHANNEL_STUB_PUSH);

  const { total } = useNormalizedPushFields();

  const navigate = useNavigate();

  const onOrderSubmit = useSubmitOrderForm({
    channelType: CHANNEL_STUB_PUSH,
    viewToDtoConverter: viewToDtoPushChannel,
    anchorRef,
    onAfterSave: () => {
      if (!NewCampaign.getCampaignPushOrder.is_editable || NewCampaign.currentCampaign.status_id === 5) {
        setIsModalOpened(true);
      } else navigate('/my-campaigns/');
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

  return (
    <div ref={anchorRef}>
      <TotalOrderInfo
        isOnModeration={!NewCampaign.getCampaignPushOrder.is_editable && NewCampaign.currentCampaign.status_id !== 5}
        channelType={CHANNEL_STUB_PUSH}
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

      {isModalOpened && (
        <StartCampaignOrEditModal
          onClose={handleCloseModal}
          channelType={CHANNEL_STUB_PUSH}
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

export default observer(TotalOrderInfoPush);
