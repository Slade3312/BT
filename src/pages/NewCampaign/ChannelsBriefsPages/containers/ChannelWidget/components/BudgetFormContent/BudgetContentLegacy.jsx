import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useFormState } from 'react-final-form';
import { useDispatch, useSelector } from 'react-redux';
import { ORDER_ACTIVE_FIELD, ORDER_BUDGET_FIELD } from 'store/NewCampaign/channels/constants';
import { setPromocodeOverdue } from 'store/NewCampaign/campaign/actions';
import { getCampaignPromocodeData } from 'store/NewCampaign/campaign/selectors';
import { FFPriceInput, FFTextLabel } from 'components/fields';
import { formatPrice } from 'utils/formatting';
import { stopPropagation } from 'utils/events';
import styles from './styles.pcss';

const cx = classNames.bind(styles);

const BudgetFormContentLegacy = ({ budget, hasInput, channelType }) => {
  const { values: { [ORDER_ACTIVE_FIELD]: isOrderActive } } = useFormState();
  const defaultBudget = formatPrice(budget);
  const proxyPrice = val => isOrderActive && val && formatPrice(val) || defaultBudget;

  const dispatch = useDispatch();

  const promocodeData = useSelector(getCampaignPromocodeData)[channelType] || {};

  const handleChange = () => {
    dispatch(setPromocodeOverdue(promocodeData));
  };

  return (
    <div className={cx('container')}>
      {!isOrderActive && <span className={cx('textFrom')}>от</span>}
      <div className={cx('wrapper')}>
        {hasInput ? (
          <div className={cx('priceInputRow')}>
            <FFPriceInput
              name={ORDER_BUDGET_FIELD}
              onMouseDown={stopPropagation}
              className={cx('priceInput')}
              onChange={handleChange}
              size="big"
              placeholder={`${formatPrice(budget)} ₽`}
              keepErrorIndent={false}
            />
          </div>
        ) : (
          <Fragment>
            <FFTextLabel
              valueProxy={proxyPrice}
              name={ORDER_BUDGET_FIELD}
              className={cx('priceLabel')}
            />
          </Fragment>
        )}
      </div>
    </div>
  );
};

BudgetFormContentLegacy.propTypes = {
  budget: PropTypes.number,
  hasInput: PropTypes.bool,
  channelType: PropTypes.string,
};

export default BudgetFormContentLegacy;
