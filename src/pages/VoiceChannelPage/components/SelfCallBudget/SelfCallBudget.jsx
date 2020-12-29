import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import { navigate, useParams } from '@reach/router';

import { observer } from 'mobx-react';
import { formatPrice, formatFloatWithComma } from 'utils/formatting';

import { ORDER_BUDGET_FIELD } from 'store/NewCampaign/channels/constants';
import { FFPriceInputWithoutError, withError } from 'components/fields';
import { CHANNEL_STUB_VOICE } from 'constants/index';
import { useVoiceChannelCalculatedInfo } from 'pages/NewCampaign/ChannelsBriefsPages/VoiceChannelPage/hooks/use-voice-calculated-info';

import { getBriefOrderVoice } from 'store/common/templates/newCampaign/briefs-selectors';
import { contactsFormByCount } from 'utils/date';
import { setOrderBudget as setOrderBudgetAction } from 'store/NewCampaign/storage/actions';

import { StoresContext } from 'store/mobx';
import styles from './styles.pcss';

const cx = classNames.bind({ ...styles });
const BudgetError = withError('span');

const SelfCallBudget = ({ setOrderBudget }) => {
  const { Templates } = useContext(StoresContext);
  const params = useParams();

  const handlePseudoLinkClick = () => {
    navigate(`/new-campaign/${params.campaignId}/audience`);
  };

  const {
    minBudget,
    isAudienceSmall,
    isBudgetValid,
    eventsCost,
    avgEvents,
    youCanAddCount,
  } = useVoiceChannelCalculatedInfo();
  const { selfCallBudget: { title, successDescription, invalidBudgetError } } = Templates.getNewCampaignTemplate('BriefOrderVoice');

  useEffect(() => {
    setOrderBudget(CHANNEL_STUB_VOICE, minBudget);
  }, []);

  return (
    <div className={cx('inputWrapper', { isValid: isBudgetValid && !isAudienceSmall, isInvalid: !isBudgetValid, isWarn: isAudienceSmall && isBudgetValid })}>
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
        <div className={cx('topInfoBlock')}>
          <div className={cx('priceInfo')}>
            <span className={cx('infoTitle')}>Цена за контакт</span>
            <span className={cx('infoNumber')}>{formatFloatWithComma(eventsCost)} ₽</span>
          </div>

          <div className={cx('countInfo')}>
            <span className={cx('infoTitle')}>Номеров для обзвона</span>
            <span className={cx('infoNumber')}>{formatPrice(avgEvents)}</span>
          </div>
        </div>

        {isBudgetValid && !isAudienceSmall && (
          <div className={cx('bottomInfoBlock')}>
            {successDescription}
          </div>
        )}

        {isAudienceSmall && isBudgetValid && (
          <div className={cx('bottomInfoBlock')}>
            <div className={cx('infoText')}>
              Вашего бюджета хвататет на добавление ещё {formatPrice(youCanAddCount)} {contactsFormByCount(youCanAddCount)}. <a className={cx('audienceLink')} href="" onClick={handlePseudoLinkClick}>Изменить настройки аудитории.</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

SelfCallBudget.propTypes = {
  setOrderBudget: PropTypes.func,
};

const mapDispatchToProps = {
  setOrderBudget: setOrderBudgetAction,
};

export default connect(null, mapDispatchToProps)(observer(SelfCallBudget));
