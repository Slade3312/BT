import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ActionButton } from 'components/buttons/ActionButtons';
import { TextInput } from 'components/fields/TextInput';
import { requestCampaignPromocode } from 'requests/client';
import { PROMOCODE_TYPES, CHANNEL_STUB_SMS } from 'constants/index';
import { StoresContext } from 'store/mobx';
import { Preloader } from '../index';
import Tooltip from '../Tooltip';
import styles from './styles.pcss';

/*
  requiredChannel - if settled than will check promocodeType exists in allowed channels
  allowedParticularChannels - validate for allowed channels (if particular)
 */

export default function PromocodeField({
  isLightButton,
  className,
  requiredChannel,
  allowedParticularChannels,
  onSetData,
  campaignId,
  isConfirmed,
  appliedPromocode,
  requestData,
}) {
  const { Templates, UserInfo: { getUserInfoCompany }, NewCampaign } = useContext(StoresContext);
  const template = Templates.getCommonTemplate('PromocodeField');

  const [promocodeError, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [promocodeValue, setPromocodeValue] = useState(appliedPromocode || '');

  const resetPromocodeData = () => {
    onSetData({ isValid: false });
    setError(null);
  };

  const handleChangePromocode = (value) => {
    setPromocodeValue(value);
    if (value) {
      setError(template.submitRequiredError);
    } else {
      resetPromocodeData();
      setError(null);
    }
  };

  const shouldDisplayTooltipWithLink = () => {
    return (
      template.tooltipWithLink && requiredChannel === CHANNEL_STUB_SMS ||
      template.tooltipWithLink && !requiredChannel
    );
  };

  const shouldDisplayTooltip = () => {
    return (
      template.tooltip &&
      requiredChannel &&
      requiredChannel !== CHANNEL_STUB_SMS
    );
  };

  const handleCheck = async () => {
    if (!promocodeValue) {
      resetPromocodeData();
      setError(template.emptyFieldError);
    } else {
      try {
        setLoading(true);
        const {
          channels,
          promo_code,
          promo_code_value_type_id,
          promo_code_value,
          promo_type_id,
        } = await requestCampaignPromocode(campaignId, {
          promo_code: promocodeValue,
          context_param: getUserInfoCompany().inn,
          events: {
            [NewCampaign.currentCampaign.channel_uid]: {
              ...NewCampaign.calculate,
            },
          },
        });

        const confirmPromocode = () => {
          onSetData({
            channels,
            code: promo_code,
            promo_code_value_type_id,
            promo_code_value,
            promo_type_id,
            isValid: true,
          });
          setError(null);
        };

        if (promo_type_id === PROMOCODE_TYPES.TOTAL) {
          // TODO temporary
          setError('Промокод этого типа не поддерживается');
        } else if (channels.some(({ channel_type }) => allowedParticularChannels.includes(channel_type))) {
          if (requiredChannel && !channels.find((item) => item.channel_type === requiredChannel)) {
            setError(template.notAllowedChannelError);
          } else {
            confirmPromocode();
          }
        } else {
          setError(template.notAllowedCampaignError);
        }
      } catch (e) {
        onSetData({ isValid: false });
        setError(e.response.data.error_message);

        if (e.response.status >= 500) {
          throw e;
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (promocodeValue !== appliedPromocode && !promocodeError) {
      setPromocodeValue(appliedPromocode);
    }
  }, [appliedPromocode]);

  const getValue = () => typeof promocodeValue === 'string' ? promocodeValue.toUpperCase() : promocodeValue;

  const successPromocodeMessage = (template?.successPromocodeMessage || '').replace('{promocode}', appliedPromocode);
  return (
    <div className={classNames(styles.component, className)}>
      <div className={styles.fieldLabelRow}>
        <span className={styles.fieldLabel}>
          {template.label}
        </span>
        {
          shouldDisplayTooltipWithLink() &&
          <Tooltip>{template.tooltipWithLink}</Tooltip>
        }
        {
          shouldDisplayTooltip() &&
          <Tooltip>{template.tooltip}</Tooltip>
        }
      </div>
      <div className={styles.inputWrapper}>
        <div className={styles.preloaderWrapper}>
          <TextInput
            error={promocodeError}
            value={getValue()}
            onChange={handleChangePromocode}
            className={styles.promocode}
            placeholder={template.placeholder}
            keepErrorIndent={false}
            disabled={isLoading}
          />
          {isLoading && <Preloader className={styles.loader} size={20} />}
        </div>

        <div className={styles.buttonWrapper}>
          <ActionButton
            disabled={isLoading}
            isLight={isLightButton}
            className={styles.button}
            onClick={handleCheck}
            iconSlug="arrowRightMinimal"
          >
            {template.submitButtonText}
          </ActionButton>
        </div>
      </div>
      {isConfirmed && <div className={styles.validText}>{successPromocodeMessage}</div>}
    </div>
  );
}

PromocodeField.propTypes = {
  className: PropTypes.string,
  isConfirmed: PropTypes.bool,
  isLightButton: PropTypes.bool,
  requiredChannel: PropTypes.string,
  onSetData: PropTypes.func,
  requestData: PropTypes.object,
  allowedParticularChannels: PropTypes.array,
  campaignId: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  appliedPromocode: PropTypes.string,
};
