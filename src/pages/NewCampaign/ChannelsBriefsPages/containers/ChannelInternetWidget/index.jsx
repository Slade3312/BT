import React from 'react';
import { useSelector } from 'react-redux';
import { useFormState } from 'react-final-form';
import { observer } from 'mobx-react';
import { checkValidToCalculateInternet } from 'store/NewCampaign/channels/selectors';
import {
  getWidgetsCardTitle,
  getWidgetsCardTariffInfo,
  getWidgetsCardTariffLinkText,
  getWidgetsCardTariffLinkUrl,
  getWidgetsEditButtonText,
  getWidgetsButtonText,
  getWidgetsEventsTextIcon,
  getChannelsWidgetsCardsItemsByIds,
} from 'store/common/templates/newCampaign/selectors';
import { getCommonCampaignChannelTypesById } from 'store/common/campaign/selectors';
import { getChannelIsChecked } from 'store/NewCampaign/storage/selectors';
import { CHANNEL_STUB_INTERNET } from 'constants/index';

import { useGetCampaignOrderForms } from 'pages/NewCampaign/hooks/use-get-campaign-order-forms';
import ChannelWidget from '../ChannelWidget/ChannelWidget';
import { useInternetChannelCalculatedInfo } from '../../hooks/use-internet-channel-calculated-info';
import { useWidgetHandlers } from '../../hooks/use-widget-handlers';

function ChannelInternetWidget() {
  const orderFormData = useGetCampaignOrderForms()[CHANNEL_STUB_INTERNET] || {};
  const channelTypeData = useSelector(getCommonCampaignChannelTypesById)[CHANNEL_STUB_INTERNET];
  const widget = useSelector(getChannelsWidgetsCardsItemsByIds)[CHANNEL_STUB_INTERNET];

  const title = getWidgetsCardTitle(widget);
  const tariffInfo = getWidgetsCardTariffInfo(widget);
  const linkText = getWidgetsCardTariffLinkText(widget);
  const linkUrl = getWidgetsCardTariffLinkUrl(widget);
  const editBriefButtonText = getWidgetsEditButtonText(widget);
  const buttonText = getWidgetsButtonText(widget);
  const eventsTextIcon = getWidgetsEventsTextIcon(widget);
  const isChannelChecked = getChannelIsChecked(orderFormData);

  const isOrderValidToCalculate = checkValidToCalculateInternet(orderFormData, channelTypeData);

  const {
    valid: isFormValid, values: { isActive, tools },
  } = useFormState();

  const { widgetBudget, avgEvents, eventsName, minEvents, maxEvents } = useInternetChannelCalculatedInfo();

  const { handleToggleChange, handleWidgetClick, isLoading } = useWidgetHandlers(CHANNEL_STUB_INTERNET);

  return (
    <ChannelWidget
      isActive={isActive}
      isLoading={isLoading}
      onClick={handleWidgetClick}
      title={title}
      tariffInfo={tariffInfo}
      linkUrl={linkUrl}
      linkText={linkText}
      editBriefButtonText={editBriefButtonText}
      buttonText={buttonText}
      eventsTextIcon={eventsTextIcon}
      isShowEditButton={isChannelChecked}
      isValidWidget={isFormValid}
      isShowPrefix={!isChannelChecked || !isOrderValidToCalculate}
      budget={widgetBudget}
      averageEvents={avgEvents}
      minEvents={minEvents}
      maxEvents={maxEvents}
      eventsName={eventsName}
      tools={tools}
      isOld
      onToggleChange={handleToggleChange}
    />
  );
}

export default observer(ChannelInternetWidget);
