import { __getCommonData } from 'store/selectors';

export const getConstants = state => __getCommonData(state).constants;

export const getConstantsVariables = state => getConstants(state).variables;
export const getNotificationShowTime = state => getConstantsVariables(state).NOTIFICATION_SHOW_TIME;

export const getMinToolsBudget = state => getConstantsVariables(state).MIN_TOOLS_BUDGET;
export const getMaxToolsBudget = state => getConstantsVariables(state).MAX_TOOLS_BUDGET;
