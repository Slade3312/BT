import React, { useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFormState } from 'react-final-form';
import { observer } from 'mobx-react';
import {
  getChannelsWidgetsCardsItemsByIds,
} from 'store/common/templates/newCampaign/selectors';
import { syncOrderDataAndEvents } from 'store/NewCampaign/storage/actions/sync';
import { CHANNEL_STUB_TARGET_INTERNET } from 'constants/index';
import { StoresContext } from 'store/mobx';
import { wordFormByCount } from 'utils/fn';
import { useChannelErrorsMap } from 'pages/NewCampaign/hooks/use-channel-errors-map';
import { useGetChannelIsActiveMap } from 'pages/NewCampaign/hooks/use-get-channel-is-active-map';
import ChannelWidget from '../ChannelWidget/ChannelWidget';
import { useWidgetHandlers } from '../../hooks/use-widget-handlers';

function ChannelTargetInternetWidget() {
  const { Social, Templates, UserInfo } = useContext(StoresContext);
  const dispatch = useDispatch();
  useEffect(() => {
    if (UserInfo?.data?.company?.self_employed) {
      const updatedValues = {
        ...Social.adStep,
        isActive: false,
      };
      Social.set('adStep', updatedValues);
      dispatch(syncOrderDataAndEvents(CHANNEL_STUB_TARGET_INTERNET, updatedValues));
    }
  }, [UserInfo?.data?.company?.self_employed]);

  const widget = useSelector(getChannelsWidgetsCardsItemsByIds)[
    CHANNEL_STUB_TARGET_INTERNET
  ];

  const { eventsNamesByCount } = Templates.getNewCampaignTemplate('BriefOrderTargetInternet');

  const eventsFormName = wordFormByCount(
    Social.getTotalEvents,
    eventsNamesByCount || [],
  );

  const {
    title,
    tariffInfo,
    linkText,
    linkUrl,
    editBriefButton,
    buttonText,
    eventsTextIcon,
  } = widget;

  const {
    valid: isFormValid,
    values: { tools },
  } = useFormState();

  const {
    handleToggleChange,
    handleWidgetClick,
    isLoading,
  } = useWidgetHandlers(CHANNEL_STUB_TARGET_INTERNET);

  const validationErrorInfo = useChannelErrorsMap()[CHANNEL_STUB_TARGET_INTERNET];
  const isActiveChannel = useGetChannelIsActiveMap()[CHANNEL_STUB_TARGET_INTERNET];


  return (
    <ChannelWidget
      isDisabled={Boolean(validationErrorInfo)}
      isContentLoading={Social.isTariffsLoading}
      isActive={isActiveChannel}
      isLoading={isLoading}
      onClick={handleWidgetClick}
      title={title}
      tariffInfo={tariffInfo}
      linkUrl={linkUrl}
      linkText={linkText}
      editBriefButtonText={editBriefButton}
      buttonText={buttonText}
      eventsTextIcon={eventsTextIcon}
      isShowEditButton={isActiveChannel}
      isValidWidget={isFormValid}
      isShowPrefix={!isActiveChannel}
      budget={Social.getTotalBudget}
      averageEvents={Social.getTotalEvents}
      eventsName={eventsFormName}
      tools={tools}
      onToggleChange={handleToggleChange}
      validationErrorInfo={validationErrorInfo}
    />
  );
}

export default observer(ChannelTargetInternetWidget);
