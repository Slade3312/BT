import React, { useEffect } from 'react';
import classNames from 'classnames/bind';

import { useFormState } from 'react-final-form';
import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { formatPrice } from 'utils/formatting';

import { ORDER_BUDGET_FIELD, ACTIVITY_FIELD } from 'store/NewCampaign/channels/constants';
import { FFPriceInputWithoutError, withError } from 'components/fields';
import { CHANNEL_STUB_VOICE } from 'constants/index';
import { useVoiceChannelCalculatedInfo } from 'pages/NewCampaign/ChannelsBriefsPages/VoiceChannelPage/hooks/use-voice-calculated-info';

import { getBriefOrderVoice } from 'store/common/templates/newCampaign/briefs-selectors';
import { customersFormByCount } from 'utils/date';
import { setOrderBudget as setOrderBudgetAction } from 'store/NewCampaign/storage/actions';
import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });
const BudgetError = withError('span');
const containerRef = React.createRef();

const CallCenterBudget = ({ setOrderBudget }) => {
  const { values } = useFormState();
  const { [ACTIVITY_FIELD]: activity } = values;
  const {
    minBudget,
    isBudgetValid,
    eventsCost,
    avgEvents,
    isFromCost,
  } = useVoiceChannelCalculatedInfo();
  const { callCenterBudget: { title, invalidBudgetError } } = useSelector(getBriefOrderVoice);

  const handleClick = (event) => {
    event.preventDefault();

    containerRef.current?.closest('form').querySelector('.react-autosuggest__input').focus();
  };

  useEffect(() => {
    setOrderBudget(CHANNEL_STUB_VOICE, minBudget);
  }, []);

  return (
    <div
      className={cx('inputWrapper', {
        isValid: isBudgetValid,
        isInvalid: !isBudgetValid,
        isNoActivity: !activity.cost,
      })}
      ref={containerRef}
    >
      <label>
        {title}

        <div className={cx('inputContainer')}>
          <FFPriceInputWithoutError
            name={ORDER_BUDGET_FIELD}
            placeholder={formatPrice(minBudget)}
            className={cx('input')}
            maxLength={8}
            autoComplete="off"
          />

          <span className={cx('ruble')}>₽</span>
        </div>

        {activity.cost && (
          <BudgetError
            errorClassName={cx('inputError')}
            name={ORDER_BUDGET_FIELD}
            error={!isBudgetValid ? invalidBudgetError.replace('{minBudget}', formatPrice(minBudget)) : null}
            keepErrorIndent={false}
          />
        )}

        {!activity.cost && (
          <p className={cx('activityError')}>
            Для расчёта рекламной кампании заполните поле  <a href="" className={cx('audienceLink')} onClick={handleClick}>«Отрасль, тип товара или услуги»</a>
          </p>
        )}
      </label>

      {activity.cost && (
        <div className={cx('infoBlock')}>
          <div className={cx('topInfoBlock')}>
            <div className={cx('priceInfo')}>
              <span className={cx('infoTitle')}>Цена за контакт</span>
              <span className={cx('infoNumber')}>{isFromCost && 'от'} {formatPrice(eventsCost)} ₽</span>
            </div>

            <div className={cx('countInfo')}>
              <span className={cx('infoTitle')}>Заинтересованных {!isBudgetValid ? 'абонентов' : customersFormByCount(avgEvents)}</span>
              <span className={cx('infoNumber')}>{!isBudgetValid ? 0 : formatPrice(avgEvents)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CallCenterBudget.propTypes = {
  setOrderBudget: PropTypes.func,
};

const mapDispatchToProps = {
  setOrderBudget: setOrderBudgetAction,
};

export default connect(null, mapDispatchToProps)(observer(CallCenterBudget));
