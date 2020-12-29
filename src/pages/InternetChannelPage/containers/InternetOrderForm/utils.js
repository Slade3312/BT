import { ARRAY_ERROR } from 'final-form';
import { toJS } from 'mobx';
import {
  ORDER_ADD_INFO_FIELD,
  ORDER_BUDGET_FIELD,
  ORDER_FINISH_DATE_FIELD,
  ORDER_INDUSTRY_FIELD,
  ORDER_MOBILE_VERSION,
  ORDER_START_DATE_FIELD,
  ORDER_TOOLS_FIELD,
  ORDER_URL_ADVERTISER_FIELD,
} from 'store/NewCampaign/channels/constants';
import { debounce } from 'utils/debounce';
import { isDeepEqual } from 'utils/isDeepEqual';
import { getTotalBudgetBySelectedTools } from 'store/NewCampaign/storage/selectors';
import { filterValuable } from 'utils/fn';
import NewCampaign from 'store/mobx/NewCampaign';

const pickFieldsToWatching = values => filterValuable({
  [ORDER_START_DATE_FIELD]: values[ORDER_START_DATE_FIELD],
  [ORDER_FINISH_DATE_FIELD]: values[ORDER_FINISH_DATE_FIELD],
  [ORDER_BUDGET_FIELD]: values[ORDER_BUDGET_FIELD],
  [ORDER_TOOLS_FIELD]: values[ORDER_TOOLS_FIELD],
  [ORDER_INDUSTRY_FIELD]: values[ORDER_INDUSTRY_FIELD],
  [ORDER_URL_ADVERTISER_FIELD]: values[ORDER_URL_ADVERTISER_FIELD],
  [ORDER_ADD_INFO_FIELD]: values[ORDER_ADD_INFO_FIELD],
  [ORDER_MOBILE_VERSION]: values[ORDER_MOBILE_VERSION],
});

export const actualizeFormWithDetectionOverdue = debounce((values) => {
  // if according business requirements depended fields (or field) was changed,
  // then let to media tariffs being overdue
  const preparedValues = toJS(values);
  const leftValues = pickFieldsToWatching(preparedValues);
  const rightValues = pickFieldsToWatching(preparedValues.lastNotOverdueFormValues || {});

  if (!isDeepEqual(leftValues, rightValues)) {
    NewCampaign.currentCampaign.currentOrder = {
      ...values,
      isOverdueTariffs: !isDeepEqual(rightValues, {}),
      lastNotOverdueFormValues: leftValues,
    };
  }
  return preparedValues;
}, 300);

export const composeArrayToolsMinBudget = (message, { minBudget }) => (value) => {
  if (getTotalBudgetBySelectedTools(value) < minBudget) {
    const errors = [];
    errors[ARRAY_ERROR] = message;
    return errors;
  }
  return null;
};
