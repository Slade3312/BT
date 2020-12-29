import { createDeepEqualSelector } from 'store/utils';
import { getTemplatesUserInfo } from '../selectors';

const getUserInfoComponent = state => getTemplatesUserInfo(state);

const getUserInfo = state => getUserInfoComponent(state).UserInfo;
const getFormUserInfo = state => getUserInfo(state).form_userInfo;

export const getPersonalInfoTemplate = createDeepEqualSelector(getFormUserInfo, template => template);
