import { PROMOCODE_VALUES_TYPES } from '../constants';

export const calcPriceByDiscount = (price, discountType, discount) =>
  discountType === PROMOCODE_VALUES_TYPES.PERCENT ? (1 - discount / 100) * price : price - discount;
