import React, { useCallback, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from '@reach/router';
import { observer } from 'mobx-react';
import { useVoiceChannelCalculatedInfo } from 'pages/NewCampaign/ChannelsBriefsPages/VoiceChannelPage/hooks/use-voice-calculated-info';
import { formatFloatWithComma, formatPriceWithLabel } from 'utils/formatting';
import { OrderSaveButton } from 'pages/NewCampaign/containers';
import { getVoiceBriefFormOrder } from 'store/common/templates/newCampaign/briefs-selectors';
import { CHANNEL_STUB_VOICE } from 'constants/index';
import StartCampaignOrEditModal from 'components/modals/StartCampaignOrEditModal';
import TotalOrderVoiceLayout from 'pages/NewCampaign/ChannelsBriefsPages/VoiceChannelPage/components/TotalOrderVoiceLayout/TotalOrderVoiceLayout';
import { useSubmitOrderForm } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/use-submit-order';
import { getStartCampaignOrEditModal } from 'store/common/templates/newCampaign/selectors';
import { NEW_CAMPAIGN_URL } from 'pages/constants';
import { viewToDtoVoiceChannel } from 'store/NewCampaign/storage/orders-view-to-dto';
import { useStartCampaign } from 'pages/NewCampaign/hooks/use-start-campaign';
import styles from './styles.pcss';

function TotalOrderInfoVoice() {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const content = useSelector(getStartCampaignOrEditModal);

  const { campaignId } = useParams();

  const anchorRef = useRef();
  const { total } = useSelector(getVoiceBriefFormOrder);
  const navigate = useNavigate();

  const { avgEvents, eventsCost, budgetToDto } = useVoiceChannelCalculatedInfo();

  const formattedBudget = formatPriceWithLabel(budgetToDto, total.budgetUnit);
  const formattedEventsCost = eventsCost && `${formatFloatWithComma(eventsCost)} ${total.costUnit}`;

  const onOrderSubmit = useSubmitOrderForm({
    channelType: CHANNEL_STUB_VOICE,
    viewToDtoConverter: viewToDtoVoiceChannel,
    anchorRef,
    onAfterSave: () => setIsModalOpened(true),
  });

  const handleCloseModal = useCallback(() => {
    setIsModalOpened(false);
  }, []);

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
      <TotalOrderVoiceLayout
        channelType={CHANNEL_STUB_VOICE}
        totalCount={avgEvents}
        budget={formattedBudget}
        eventsCost={formattedEventsCost}
        perEventName={total.unitName}
        totalTitle={total.title}
        budgetTitle={total.budgetTitle}
        costTitle={total.costTitle}
        countName={total.countName}
      >
        <OrderSaveButton
          onClick={onOrderSubmit}
          isLight
          className={styles.orderButton}
        >
          {total.button}
        </OrderSaveButton>
      </TotalOrderVoiceLayout>

      {isModalOpened && (
        <StartCampaignOrEditModal
          onClose={handleCloseModal}
          channelType={CHANNEL_STUB_VOICE}
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

export default observer(TotalOrderInfoVoice);
