import React from 'react';
import PropTypes from 'prop-types';
import { useFormState } from 'react-final-form';
import { useSelector } from 'react-redux';
import { observer } from 'mobx-react';
import { ActionButton } from 'components/buttons';
import { ORDER_BUDGET_FIELD } from 'store/NewCampaign/channels/constants';
import { CHANNEL_STUB_VOICE } from 'constants/index';
import { OverlayLock } from 'components/common/Loaders/components';

import {
  getWidgetsCardById,
  getWidgetsCardTitle,
  getWidgetsEditButtonText,
  getWidgetsButtonText,
  getWidgetsEventsTextIcon,
} from 'store/common/templates/newCampaign/selectors';

import { getBriefOrderVoice } from 'store/common/templates/newCampaign/briefs-selectors';
import { useVoiceChannelCalculatedInfo } from '../../VoiceChannelPage/hooks/use-voice-calculated-info';
import { useWidgetHandlers } from '../../hooks/use-widget-handlers';
import { withWidgetEventsState } from './helpers';
import {
  TitledLink,
  BudgetFormContentLegacy,
  CounterEvents,
  Separator,
  IconInfoContent,
  WidgetWrapper,
  ToggleSwitch,
  EditLink,
} from './components';

import styles from './styles.pcss';

const getVoiceTabLabel = (id) => {
  switch (id) {
    case 1:
      return 'Самостоятельный обзвон';
    case 2:
      return 'Обзвон колл-центром «Билайн»';
    case 3:
      return 'Индивидуальные условия';
    default:
      return null;
  }
};

function VoiceChannelWidget({ isMouseOverWidget }) {
  const {
    valid: isFormValid,
    errors: { budget: hasBudgetError },
    active,
    values: { isActive, connectionType },
  } = useFormState();

  const widget = useSelector(getWidgetsCardById(CHANNEL_STUB_VOICE));
  const title = getWidgetsCardTitle(widget);
  const editBriefButtonText = getWidgetsEditButtonText(widget);
  const buttonText = getWidgetsButtonText(widget);
  const eventsTextIcon = getWidgetsEventsTextIcon(widget);

  const isBudgetFieldActive = active === ORDER_BUDGET_FIELD;
  const hasInput = Boolean(isActive && (isMouseOverWidget || isBudgetFieldActive || hasBudgetError));

  const { minBudget, minEvents, maxEvents, avgEvents, eventsName } = useVoiceChannelCalculatedInfo();
  const { handleToggleChange, handleWidgetClick, isLoading } = useWidgetHandlers(CHANNEL_STUB_VOICE);
  const { channelCard: { newTitle, newDescription } } = useSelector(getBriefOrderVoice);

  return (
    <OverlayLock isLoading={isLoading}>
      <WidgetWrapper onClick={handleWidgetClick} title={title}>
        <div className={styles.topWrapper}>
          <ToggleSwitch value={isActive} onChange={handleToggleChange} isLoading={isLoading} />

          <TitledLink>{title}</TitledLink>

          <BudgetFormContentLegacy channelType={CHANNEL_STUB_VOICE} budget={minBudget} hasInput={hasInput} />
        </div>

        <Separator isTransparent={hasInput} />

        <div className={styles.middleWrapper}>
          {connectionType !== 3 && (
            <>
              <CounterEvents min={minEvents} max={maxEvents} avg={avgEvents} />

              <IconInfoContent eventsName={eventsName} iconSlug={eventsTextIcon} />
            </>
          )}

          {!isActive && (
            <div className={styles.tabsContainer}>
              <div className={styles.newTab}>{newTitle}</div>

              <span className={styles.newInfo}>{newDescription}</span>
            </div>
          )}

          {connectionType && isActive && (
            <div className={styles.tabsContainer}>
              <div className={styles.tab}>{getVoiceTabLabel(connectionType)}</div>
            </div>
          )}
        </div>

        {!isActive ? null : <Separator />}

        <div className={styles.bottomWrapper}>
          {isActive &&
            (!isFormValid ? (
              <ActionButton className={styles.button} iconSlug="arrowRightMinimal">
                {buttonText}
              </ActionButton>
            ) : (
              <EditLink>{editBriefButtonText}</EditLink>
            ))}
        </div>
      </WidgetWrapper>
    </OverlayLock>
  );
}

VoiceChannelWidget.propTypes = {
  isMouseOverWidget: PropTypes.bool,
};

export default withWidgetEventsState(observer(VoiceChannelWidget));
