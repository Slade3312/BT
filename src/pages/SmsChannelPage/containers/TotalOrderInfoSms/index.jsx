import React, { useContext, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from '@reach/router';
import { useForm, useFormState } from 'react-final-form';
import Skeleton from 'react-loading-skeleton';
import { observer } from 'mobx-react';
import moment from 'moment';
import { action } from 'mobx';
import { putOrderRequest } from 'requests/campaigns';
import { StoresContext } from 'store/mobx';
import { formatFloatWithComma, formatPrice, formatPriceWithLabel } from 'utils/formatting';
import { CHANNEL_STUB_SMS } from 'constants/index';
import { OrderSaveButton } from 'pages/NewCampaign/containers';

import { useBaseChannelCalculatedInfo } from 'pages/NewCampaign/ChannelsBriefsPages/hooks/use-base-channels-calculated-info';
import { defaultTimeRange } from 'components/fields/TimeRangeSlider';
import { STEP_SLUG_CHANNELS } from 'store/NewCampaign/constants';
import StartCampaignOrEditModal, { TEMPLATES } from 'components/modals/StartCampaignOrEditModal';
import confirmDialog from 'components/modals/confirmDialog';
import {
  ORDER_BUDGET_FIELD,
  ORDER_SENDER_NAME_FIELD,
  ORDER_MESSAGE_FIELD,
  ORDER_SENDING_FIELD,
  USE_ONLINE_GEO,
  ORDER_DATE,
  GEO_POINTS,
  ORDER_START_DATE_FIELD,
  ORDER_FINISH_DATE_FIELD, ORDER_TEST_NUMBERS_FIELD, ORDER_SERVICES_FIELD, ORDER_LINKS_FIELD, EXTERNAL_OPERATOR,
} from 'store/NewCampaign/channels/constants';
import { pushDraftSaveErrorToGA, pushDraftSaveSuccessToGA } from 'utils/ga-analytics/utils';
import { SMS_ORDER_FORM_ID } from 'pages/NewCampaign/constants';
import { useScrollToInvalid } from 'hooks/use-scroll-to-invalid';
import PromocodeErrorModal from 'components/modals/PromocodeErrorModal';
import { formatTestPhoneNumbers } from 'store/NewCampaign/storage/orders-view-to-dto';
import checkForInn from 'store/mobx/requests/checkForInn';
import { Tooltip } from 'components/common';
import PromocodeField from 'components/common/PromocodeField';
import { NEW_CAMPAIGN_CHANNELS } from 'store/constants';
import { useFieldChangeDetector } from 'hooks/use-fields-change-detector';
import styles from './styles.pcss';

function TotalOrderInfoSms({ emulatorText }) {
  const { NewCampaign, Templates, WebsAndPhonesTaxons, Common } = useContext(StoresContext);
  const anchorRef = useRef();
  const { total } = Templates.getNewCampaignTemplate('BriefOrderSms').form_order;
  const navigate = useNavigate();
  const { avgEvents, maxEvents, minEvents, event_cost, eventsName, budgetToDto, eventsExternalName }
  = useBaseChannelCalculatedInfo(CHANNEL_STUB_SMS);

  const calculateTotalCount = () => {
    if (avgEvents) {
      return `${formatPrice(avgEvents)} ${eventsName}`;
    }
    if (minEvents || maxEvents) {
      return `от ${formatPrice(minEvents)} до ${formatPrice(maxEvents)} ${eventsName}`;
    }
    return null;
  };

  const formattedBudget = formatPriceWithLabel(budgetToDto, total.budgetUnit);
  const formattedEventsCost = event_cost && `${formatFloatWithComma(event_cost)} ${total.costUnit}`;

  const { valid } = useFormState();
  const { submit } = useForm();
  const [anchorNode, setAnchorNode] = useState(null);

  const onScroll = useScrollToInvalid(anchorNode);

  useEffect(() => {
    const formNode = anchorRef?.current ?? document.forms[SMS_ORDER_FORM_ID];
    setAnchorNode(formNode);
  }, []);

  const onOrderSubmit = async ({ ignore_promo_code }) => {
    if (!valid) {
      onScroll();
      submit();
      return;
    }
    NewCampaign.startingCampaign = true;
    try {
      await putOrderRequest({
        campaignId: NewCampaign.currentCampaign.id,
        channelType: CHANNEL_STUB_SMS,
        data: {
          [ORDER_BUDGET_FIELD]: +NewCampaign.currentCampaign.currentOrder[ORDER_BUDGET_FIELD],
          [ORDER_LINKS_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_MESSAGE_FIELD]?.links.map(item => {
            return {
              ...item,
              shortLink: item.isShort && item.shortLink || 'none',
            };
          }) || [],
          data: {
            [ORDER_SENDER_NAME_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_SENDER_NAME_FIELD],
            shortText: emulatorText,
            [ORDER_MESSAGE_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_MESSAGE_FIELD].text,
            [ORDER_SENDING_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_SENDING_FIELD] || defaultTimeRange,
            [USE_ONLINE_GEO]: NewCampaign.currentCampaign.currentOrder[USE_ONLINE_GEO] || false,
            [ORDER_TEST_NUMBERS_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_TEST_NUMBERS_FIELD] ?
              formatTestPhoneNumbers(NewCampaign.currentCampaign.currentOrder[ORDER_TEST_NUMBERS_FIELD]) : undefined,
            [ORDER_SERVICES_FIELD]: NewCampaign.currentCampaign.currentOrder[ORDER_SERVICES_FIELD] ?
              NewCampaign.currentCampaign.currentOrder[ORDER_SERVICES_FIELD] : undefined,
            [GEO_POINTS]: NewCampaign.currentCampaign.currentOrder[USE_ONLINE_GEO] ? NewCampaign.currentCampaign.currentOrder[GEO_POINTS] : [],
          },
          [ORDER_START_DATE_FIELD]:
            WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' &&
            NewCampaign.currentCampaign.currentOrder[ORDER_DATE][0] ||
            moment(NewCampaign.currentCampaign.currentOrder[ORDER_START_DATE_FIELD]).format('YYYY-MM-DD'),
          [ORDER_FINISH_DATE_FIELD]:
            WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' &&
            NewCampaign.currentCampaign.currentOrder[ORDER_DATE][1] ||
            moment(NewCampaign.currentCampaign.currentOrder[ORDER_FINISH_DATE_FIELD]).format('YYYY-MM-DD'),
          files: NewCampaign.currentCampaign.currentOrder.files.map(item => item.id),
          locations: [],
          [EXTERNAL_OPERATOR]: NewCampaign.currentCampaign.currentOrder.external_operator,
          ignore_promo_code,
        },
      });
      if (NewCampaign.currentCampaign.status_id === 5) {
        const isRegistered = await checkForInn();
        if (!isRegistered) return;
        await NewCampaign.startCampaign();
        pushDraftSaveSuccessToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: CHANNEL_STUB_SMS });
      }
      submit();
      await confirmDialog(StartCampaignOrEditModal, {
        templateSource: NewCampaign.currentCampaign.status_id === 5 ? TEMPLATES.SUCCESS : TEMPLATES.UPDATED,
      });
      await navigate('/my-campaigns/');
    } catch (e) {
      if (e?.response?.status === 400 && e?.response?.data?.promo_code_error) {
        try {
          const answer = await confirmDialog(PromocodeErrorModal, { description: e.response.data.promo_code_error });
          if (answer) {
            await onOrderSubmit({ ignore_promo_code: e.response.data.error_promo_code_id });
          }
          return;
        } catch (err) {
          console.log(err);
        }
      }
      pushDraftSaveErrorToGA({ slugTitle: STEP_SLUG_CHANNELS, subSlugTitle: CHANNEL_STUB_SMS });
      await confirmDialog(StartCampaignOrEditModal, { templateSource: TEMPLATES.FAIL });
    } finally {
      NewCampaign.startingCampaign = false;
    }
  };

  const promocodeData = NewCampaign.currentCampaign.promocode || {};

  const setPromocodeDataAction = action((data) => {
    NewCampaign.currentCampaign.promocode = data;
  });

  const { channelHasChangedMessage } = Templates.getCommonTemplate('PromocodeField');

  useFieldChangeDetector(() => {
    if (promocodeData.isValid && !promocodeData.isOverdue) {
      NewCampaign.currentCampaign.promocode = {
        isOverdue: true, isValid: false, code: '',
      };
    }
  });

  const isOnModeration = !NewCampaign.getCampaignTargetSmSOrder.is_editable && NewCampaign.currentCampaign.status_id !== 5;
  const promocodeRequestData = NewCampaign.calculate;

  return (
    <>
      <div ref={anchorRef}>
        <div className={styles.container}>
          <div className={styles.totalInner}>
            <div className={styles.title}>{total.title}</div>
            <div className={styles.description}>Таргетированная SMS-рассылка</div>

            <div className={styles.innerContainer}>
              <div className={styles.row}>
                <div className={styles.infoTitle}>
                  {total.countName}
                </div>
                <div className={styles.infoTitle}>
                  {calculateTotalCount()}
                  {/* <Tooltip>Текст</Tooltip> */}
                </div>
              </div>

              <div className={styles.row}>
                <div className={styles.infoTitle}>
                  {total.costTitle}
                </div>
                <div className={styles.infoTitle}>
                  {formattedEventsCost}
                  {/* <Tooltip>Текст</Tooltip> */}
                </div>
              </div>

              {
                NewCampaign.currentCampaign.currentOrder.external_operator &&
                <div className={styles.row}>
                  <div className={styles.infoTitle}>
                    Количество сообщений<br/>на других операторов
                  </div>
                  <div className={styles.infoTitle}>
                    {NewCampaign.calculate.external_operator_qty} {eventsExternalName}
                    {/* <Tooltip>Текст</Tooltip> */}
                  </div>
                </div>
              }

              <div className={styles.divider} />

              {
                (NewCampaign.shouldPayForName && NewCampaign.currentCampaign.currentOrder?.external_operator) &&
                <div className={styles.row}>
                  <div className={styles.infoTitle}>
                    Стоимость за имя отправителя
                  </div>
                  <div className={styles.infoTitle}>
                    {formatPriceWithLabel(Common.constants.EXTERNAL_OPERATOR_NAME_SENDER_BUDGET)}
                    {/* <Tooltip>Текст</Tooltip> */}
                  </div>
                </div>
              }

              <div className={styles.row}>
                <div className={styles.infoTitle}>
                  {total.planningBudget}
                </div>
                <div className={styles.infoTitle}>
                  {formattedBudget}
                  {/* <Tooltip>Текст</Tooltip> */}
                </div>
              </div>

            </div>
            {!isOnModeration &&
            <div className={styles.promoHolder}>
              <div className={styles.innerContainer}>
                <PromocodeField
                  appliedPromocode={promocodeData.code}
                  requiredChannel={NewCampaign.currentCampaign.channel_uid}
                  onSetData={setPromocodeDataAction}
                  isConfirmed={promocodeData.isValid}
                  campaignId={NewCampaign.currentCampaign.id}
                  allowedParticularChannels={NEW_CAMPAIGN_CHANNELS}
                  requestData={promocodeRequestData}
                  />

                {!promocodeData?.isValid && promocodeData?.isOverdue && (
                <div className={styles.promocodeInfo}>
                  {channelHasChangedMessage}
                </div>
                  )}
              </div>
            </div>
            }
            <div className={styles.innerContainer}>
              {
                promocodeData.isValid &&
                <div className={`${styles.row} ${styles.rowSale}`}>
                  <div className={styles.infoTitle}>
                    {total.saleText}
                  </div>
                  <div className={styles.infoTitle}>
                    - {NewCampaign.getPrettyPromocode}
                    {/* <Tooltip>Текст</Tooltip> */}
                  </div>
                </div>
              }
              <div className={`${styles.row} ${styles.totalRow}`}>
                <div className={styles.total}>
                  {total.toPay}
                </div>
                <div className={styles.total}>
                  {
                    promocodeData.isValid &&
                    formatPriceWithLabel(NewCampaign.getPriceWithPromocode) ||
                    formattedBudget
                  }
                </div>
              </div>
            </div>
            {
              NewCampaign.startingCampaign &&
              <Skeleton width={291} height={50} className={styles.btn}/> ||
              <OrderSaveButton onClick={onOrderSubmit} className={styles.btn}>
                {total.button}
              </OrderSaveButton>
            }
          </div>

        </div>
      </div>
    </>
  );
}

TotalOrderInfoSms.propTypes = {
  emulatorText: PropTypes.string,
};

export default observer(TotalOrderInfoSms);
