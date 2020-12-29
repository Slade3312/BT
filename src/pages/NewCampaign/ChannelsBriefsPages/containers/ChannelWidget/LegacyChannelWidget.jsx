import React from 'react';
import PropTypes from 'prop-types';
import { useFormState } from 'react-final-form';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { observer } from 'mobx-react';
import { ActionButton } from 'components/buttons';
import { ORDER_BUDGET_FIELD } from 'store/NewCampaign/channels/constants';
import { CHANNEL_STUB_VOICE, CHANNEL_STUB_SMS, CHANNEL_STUB_PUSH } from 'constants/index';
import { OverlayLock } from 'components/common/Loaders/components';

import {
  getWidgetsCardById,
  getWidgetsCardTitle,
  getWidgetsEditButtonText,
  getWidgetsButtonText,
  getWidgetsEventsTextIcon,
} from 'store/common/templates/newCampaign/selectors';

import { getBriefOrderVoice } from 'store/common/templates/newCampaign/briefs-selectors';
import { useBaseChannelCalculatedInfo } from '../../hooks/use-base-channels-calculated-info';
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

const formatDate = (date) => {
  return moment(date).format('DD.MM.YYYY');
};

function LegacyChannelWidget({ isMouseOverWidget, channelType }) {
  const {
    valid: isFormValid,
    errors: { budget: hasBudgetError },
    active,
    values: { isActive, date, connectionType },
  } = useFormState();

  const widget = useSelector(getWidgetsCardById(channelType));
  const title = getWidgetsCardTitle(widget);
  const editBriefButtonText = getWidgetsEditButtonText(widget);
  const buttonText = getWidgetsButtonText(widget);
  const eventsTextIcon = getWidgetsEventsTextIcon(widget);

  const isBudgetFieldActive = active === ORDER_BUDGET_FIELD;
  const hasInput = Boolean(isActive && (isMouseOverWidget || isBudgetFieldActive || hasBudgetError));

  const { minBudget, minEvents, maxEvents, avgEvents, eventsName } = useBaseChannelCalculatedInfo(channelType);
  const { handleToggleChange, handleWidgetClick, isLoading } = useWidgetHandlers(channelType);
  const { channelCard: { newTitle, newDescription } } = useSelector(getBriefOrderVoice);

  return (
    <OverlayLock isLoading={isLoading}>
      <WidgetWrapper onClick={handleWidgetClick} title={title}>
        <div className={styles.topWrapper}>
          <ToggleSwitch value={isActive} onChange={handleToggleChange} isLoading={isLoading} />

          <TitledLink>{title}</TitledLink>

          <BudgetFormContentLegacy channelType={channelType} budget={minBudget} hasInput={hasInput} />
        </div>

        <Separator isTransparent={hasInput} />

        <div className={styles.middleWrapper}>
          {connectionType !== 3 && (
            <>
              <CounterEvents min={minEvents} max={maxEvents} avg={avgEvents} />

              <IconInfoContent eventsName={eventsName} iconSlug={eventsTextIcon} />
            </>
          )}

          {(channelType === CHANNEL_STUB_SMS || channelType === CHANNEL_STUB_PUSH) && date && date[0] && date[1] && isActive && (
            <div className={styles.tabsContainer}>
              <div className={styles.tab}>
                {`${formatDate(date[0])} — ${formatDate(date[1])}`}
              </div>
            </div>
          )}

          {(channelType === CHANNEL_STUB_VOICE) && !isActive && (
            <div className={styles.tabsContainer}>
              <div className={styles.newTab}>{newTitle}</div>

              <span className={styles.newInfo}>{newDescription}</span>
            </div>
          )}

          {(channelType === CHANNEL_STUB_VOICE) && connectionType && isActive && (
            <div className={styles.tabsContainer}>
              <div className={styles.tab}>{getVoiceTabLabel(connectionType)}</div>
            </div>
          )}
        </div>

        {(channelType === CHANNEL_STUB_VOICE) && !isActive ? null : <Separator />}

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

LegacyChannelWidget.propTypes = {
  isMouseOverWidget: PropTypes.bool,
  channelType: PropTypes.string,
};

export default withWidgetEventsState(observer(LegacyChannelWidget));
