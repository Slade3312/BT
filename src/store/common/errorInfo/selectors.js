import { __getCommonData } from '../../selectors';
import { ERROR_NON_BLOCKING } from './constants';

export const getGlobalErrorData = state => __getCommonData(state).errorInfo;
export const getGlobalErrorStatusCode = state => getGlobalErrorData(state).statusCode;
export const getGlobalErrorType = state => getGlobalErrorData(state).type;

const getHasErrors = state => !!getGlobalErrorStatusCode(state);
export const getHasNonBlockingError = state => getGlobalErrorType(state) === ERROR_NON_BLOCKING;
export const getHasBlockingError = state => getHasErrors(state) && !getHasNonBlockingError(state);

export const getGlobalErrorMessage = () => 'Что-то пошло не так, попробуйте повторить позднее';
// export const getGlobalErrorMessage = state => getGlobalErrorData(state).message.toString();
