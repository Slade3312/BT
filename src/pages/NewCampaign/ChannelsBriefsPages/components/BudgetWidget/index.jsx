import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import commonStyles from 'styles/common.pcss';
import { formatPrice } from 'utils/formatting';
import { ORDER_BUDGET_FIELD } from 'store/NewCampaign/channels/constants';
import { FormFieldLabel } from 'components/forms';
import { FFPriceInput } from 'components/fields';
import { withError } from 'components/fields/TextInput/enhancers';
import { withForwardedRef } from 'enhancers';
import BudgetEventsCounter from '../BudgetEventsCounter';
import { useBaseChannelCalculatedInfo } from '../../hooks/use-base-channels-calculated-info';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

const PriceInput = withError(withForwardedRef(FFPriceInput));

function BudgetWidget({ channelType, className, isDisabled }) {
  const budgetField = {
    label: '',
    tooltip: '',
  };

  const {
    minBudget,
    isAudienceSmall,
    isBudgetValid,
    minEvents,
    maxEvents,
    avgEvents,
    eventsName,
  } = useBaseChannelCalculatedInfo(channelType);

  const label = budgetField?.label;
  const tooltip = budgetField?.tooltip;

  return (
    <div className={cx('container', className)}>
      <FormFieldLabel isBold tooltip={tooltip} className={cx('marb-xxxs')}>
        {label}
      </FormFieldLabel>

      <div className={cx('inputWrapper', { isValid: !isAudienceSmall && isBudgetValid })}>
        <PriceInput
          disabled={isDisabled}
          name={ORDER_BUDGET_FIELD}
          placeholder={formatPrice(minBudget)}
          keepErrorIndent={false}
          className={cx('input')}
          maxLength={8}
          error={!isBudgetValid ? `Минимальный бюджет ${formatPrice(minBudget)}₽` : null}
        />

        <div className={cx('triangle')} />

        {minEvents || maxEvents || avgEvents ? (
          <BudgetEventsCounter
            min={minEvents}
            max={maxEvents}
            avg={avgEvents}
            isAudienceSmall={isAudienceSmall}
            channelType={channelType}
            eventsName={eventsName}
          />
        ) : null}
      </div>
    </div>
  );
}

BudgetWidget.propTypes = {
  channelType: PropTypes.string,
  className: PropTypes.string,
  isDisabled: PropTypes.bool,
};

export default observer(BudgetWidget);
