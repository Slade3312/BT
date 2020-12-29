import { ARRAY_ERROR } from 'final-form';
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
import { syncOrderData } from 'store/NewCampaign/storage/actions/sync';
import { getTotalBudgetBySelectedTools } from 'store/NewCampaign/storage/selectors';
import { CHANNEL_STUB_INTERNET } from 'constants/index';
import { filterValuable } from 'utils/fn';

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

export const actualizeFormWithDetectionOverdue = debounce((values, dispatch) => {
  // if according business requirements depended fields (or field) was changed,
  // then let to media tariffs being overdue
  const leftValues = pickFieldsToWatching(values);
  const rightValues = pickFieldsToWatching(values.lastNotOverdueFormValues || {});

  if (!isDeepEqual(leftValues, rightValues)) {
    dispatch(syncOrderData(CHANNEL_STUB_INTERNET, {
      ...values,
      // let overdue being always false if it's first initial
      isOverdueTariffs: !isDeepEqual(rightValues, {}),
      lastNotOverdueFormValues: leftValues,
    }));
  }
  return values;
}, 300);

export const composeArrayToolsMinBudget = (message, { minBudget }) => (value) => {
  if (getTotalBudgetBySelectedTools(value) < minBudget) {
    const errors = [];
    errors[ARRAY_ERROR] = message;
    return errors;
  }
  return null;
};
