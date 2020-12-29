
import { USER_INFO_API_URL } from '../constants';
import { composeAxiosUpdateRequest } from '../helpers';

export const mutateUserInfoRequest = composeAxiosUpdateRequest({
  url: USER_INFO_API_URL,
});
