import { axiosAuthorizedRequest } from '../helpers';
import { FAQ_CATEGORIES } from './constants';

export const requestFaqCategories = () => axiosAuthorizedRequest({ url: FAQ_CATEGORIES });
