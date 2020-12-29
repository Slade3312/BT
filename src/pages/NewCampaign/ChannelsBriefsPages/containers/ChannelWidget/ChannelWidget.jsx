import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { ActionButton } from 'components/buttons';
import { OverlayLock, ReplaceLoader } from 'components/common/Loaders/components';
import ValidationInformator
  from 'pages/NewCampaign/ChannelsBriefsPages/containers/ChannelWidget/components/ValidationInformator';
import {
  TitledLink,
  CounterEvents,
  Separator,
  IconInfoContent,
  WidgetWrapper,
  ToggleSwitch,
  EditLink,
  BudgetContent,
} from './components';
import { withWidgetEventsState } from './helpers';

import styles from './styles.pcss';

function ChannelWidget({
  title,
  editBriefButtonText,
  buttonText,
  eventsTextIcon,
  isShowEditButton,
  isValidWidget,
  isShowPrefix,
  budget,
  averageEvents,
  minEvents,
  maxEvents,
  eventsName,
  onClick,
  onToggleChange,
  isLoading,
  isContentLoading,
  isActive,
  tools,
  validationErrorInfo,
  isDisabled,
  isOld,
}) {
  return (
    <OverlayLock isLoading={isLoading}>
      <WidgetWrapper title={title} onClick={onClick}>

        <div className={styles.topWrapper}>
          <ToggleSwitch isDisabled={isDisabled} value={isActive} isLoading={isLoading} onChange={onToggleChange} />

          <TitledLink isDisabled={isDisabled}>{title}</TitledLink>

          {!isContentLoading && <BudgetContent isDisabled={isDisabled} isShowPrefix={isShowPrefix} budget={budget} />}
        </div>

        <ReplaceLoader isLoading={isContentLoading}>
          <Separator />

          <div className={styles.middleWrapper}>
            <CounterEvents isDisabled={isDisabled} avg={averageEvents} min={minEvents} max={maxEvents} />

            <IconInfoContent isDisabled={isDisabled} eventsName={eventsName} iconSlug={eventsTextIcon} />
            {!isActive && !isOld && (
            <div className={styles.tabsContainer}>
              <div className={styles.newTab}>Новая услуга</div>
            </div>
            )}
            {validationErrorInfo && <ValidationInformator text={validationErrorInfo} />}

            <div className={styles.tabsContainer}>
              {tools && tools.filter((item) => item.isActive).map((item) => {
              return <div className={styles.tab} key={item.name}>{item.name}</div>;
            })}
            </div>
          </div>

        </ReplaceLoader>

        <Separator />

        <div className={styles.bottomWrapper}>
          {isShowEditButton &&
            (!isValidWidget ? (
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

ChannelWidget.propTypes = {
  title: PropTypes.string,
  editBriefButtonText: PropTypes.string,
  buttonText: PropTypes.string,
  eventsTextIcon: PropTypes.string,
  isShowEditButton: PropTypes.bool,
  isValidWidget: PropTypes.bool,
  isShowPrefix: PropTypes.bool,
  budget: PropTypes.number,
  averageEvents: PropTypes.number,
  minEvents: PropTypes.number,
  maxEvents: PropTypes.number,
  eventsName: PropTypes.string,
  onClick: PropTypes.func,
  isLoading: PropTypes.bool,
  isContentLoading: PropTypes.bool,
  isActive: PropTypes.bool,
  onToggleChange: PropTypes.func,
  tools: PropTypes.array,
  validationErrorInfo: PropTypes.string,
  isDisabled: PropTypes.bool,
  isOld: PropTypes.string,
};

export default withWidgetEventsState(observer(ChannelWidget));
