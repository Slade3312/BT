import React, { useContext, useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import { useFormState } from 'react-final-form';
import { Heading } from 'components/layouts';
import commonStyles from 'styles/common.pcss';
import { formatPriceWithLabel } from 'utils/formatting';
import { calcPriceByDiscount } from 'utils/business';
import { ActionButton } from 'components/buttons/ActionButtons';
import { CHANNEL_STUB_FOCUS } from 'constants/index';
import { StoresContext } from 'store/mobx';
import PromocodeField from 'components/common/PromocodeField';
import StrikeThroughText from 'components/common/StrikeThroughText';
import { pushToGA } from 'utils/ga-analytics/data-layer';
import { FIELD_BUDGET } from '../../constants';
import IconChooser from '../IconChooser';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

function CalculateCostStep() {
  const {
    CreateReport: { processOrderReport, values },
    UserInfo: { getUserInfoData, getUserInfoCompany },
    Templates: {
      getAudienceStatisticTemplate,
    },
  } = useContext(StoresContext);

  const { title } = getAudienceStatisticTemplate('LoadBaseBanner');
  const { email } = getUserInfoData();
  const { post_pay } = getUserInfoCompany();
  const {
    values: { [FIELD_BUDGET]: budget },
  } = useFormState();

  const [promocodeData, setPromocodeData] = useState({ isValid: false });

  const focusPromocodeData =
    promocodeData?.channels?.find(
      (item) => item.channel_type === CHANNEL_STUB_FOCUS
    ) || {};
  const discountPrice = promocodeData.isValid
    ? calcPriceByDiscount(
      budget,
      focusPromocodeData.value_type_id,
      focusPromocodeData.promo_code_value,
    )
    : budget;

  const handlerProcessOrder = () => {
    processOrderReport({ promocode: promocodeData.isValid && promocodeData.code, campaignId: values.campaignId });
  };

  useEffect(() => {
    pushToGA({
      event: 'event_b2b_audienceAnalysis',
      action: 'show_Подтвердите заказ услуги',
      blockName: title,
    });
  }, []);

  return (
    <>
      <IconChooser
        className={cx('marb-l')}
        type={IconChooser.propConstants.types.success}
      />
      <Heading level={2} className={cx('marb-m')}>
        {post_pay ? 'Подтвердите заказ услуги' : 'Ваш отчёт готов'}
      </Heading>

      <div className={cx('content', 'marb-xl')}>
        <PromocodeField
          className={cx('marb-m')}
          appliedPromocode={promocodeData.code}
          requiredChannel={CHANNEL_STUB_FOCUS}
          onSetData={setPromocodeData}
          isConfirmed={promocodeData.isValid}
          campaignId={values.campaignId}
          allowedParticularChannels={[CHANNEL_STUB_FOCUS]}
        />

        <Heading level={3} className={cx('marb-s')}>
          <div className={styles.costInfo}>
            <span>{post_pay ? 'Анализ аудитории стоит' : 'Стоимость -'}</span>{' '}
            {promocodeData.isValid && (
              <StrikeThroughText className={styles.previousPrice}>
                {formatPriceWithLabel(budget)}
              </StrikeThroughText>
            )}
            <span className={styles.price}>
              {formatPriceWithLabel(discountPrice)}
            </span>
          </div>
        </Heading>
        {post_pay ? (
          <span className={cx('text')}>
            {/* eslint-disable-next-line max-len */}
            Вы получите отчет по аудитории в личном кабинете Билайн.ПРОдвижения.
            Счет будет выставлен в начале следующего месяца.
          </span>
        ) : (
          <>
            <span className={cx('text')}>
              Отчёт станет доступен после оплаты.
            </span>
            <span className={cx('text')}>
              Счёт будет направлен на почту {email} в течение 24 часов
            </span>
          </>
        )}
      </div>
      <ActionButton iconSlug="arrowRightLong" onClick={handlerProcessOrder}>
        {post_pay ? 'Подтверждаю заказ' : 'Заказать отчёт'}
      </ActionButton>
    </>
  );
}

export default observer(CalculateCostStep);
