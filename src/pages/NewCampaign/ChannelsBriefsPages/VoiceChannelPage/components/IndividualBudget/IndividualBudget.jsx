import React, { useEffect } from 'react';
import classNames from 'classnames/bind';

import { connect, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { formatPrice } from 'utils/formatting';

import { ORDER_BUDGET_FIELD } from 'store/NewCampaign/channels/constants';
import { FFPriceInputWithoutError, withError } from 'components/fields';
import { CHANNEL_STUB_VOICE } from 'constants/index';
import { useVoiceChannelCalculatedInfo } from 'pages/NewCampaign/ChannelsBriefsPages/VoiceChannelPage/hooks/use-voice-calculated-info';

import { getBriefOrderVoice } from 'store/common/templates/newCampaign/briefs-selectors';
import { setOrderBudget as setOrderBudgetAction } from 'store/NewCampaign/storage/actions';
import HandsFree from '../../assets/icons/HandsFree.svg';
import styles from './styles.pcss';

const cx = classNames.bind(styles);
const BudgetError = withError('span');

const IndividualBudget = ({ setOrderBudget }) => {
  const {
    minBudget,
    isBudgetValid,
  } = useVoiceChannelCalculatedInfo();
  const { individualBudget: { title, successDescription, invalidBudgetError } } = useSelector(getBriefOrderVoice);

  useEffect(() => {
    setOrderBudget(CHANNEL_STUB_VOICE, minBudget);
  }, []);

  return (
    <div className={cx('inputWrapper', {
      isValid: isBudgetValid,
      isInvalid: !isBudgetValid,
    })}>
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

        <BudgetError
          errorClassName={cx('inputError')}
          name={ORDER_BUDGET_FIELD}
          error={!isBudgetValid ? invalidBudgetError.replace('{minBudget}', formatPrice(minBudget)) : null}
          keepErrorIndent={false}
        />
      </label>

      <div className={cx('infoBlock')}>
        {isBudgetValid && (
          <div className={cx('bottomInfoBlock')}>
            <div className={cx('infoIcon')}>
              <HandsFree/>
            </div>

            <div className={cx('infoText')}>{successDescription}</div>
          </div>
        )}
      </div>
    </div>
  );
};

IndividualBudget.propTypes = {
  setOrderBudget: PropTypes.func,
};

const mapDispatchToProps = {
  setOrderBudget: setOrderBudgetAction,
};

export default connect(null, mapDispatchToProps)(observer(IndividualBudget));
