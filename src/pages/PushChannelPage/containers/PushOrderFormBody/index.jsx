import React, { Fragment, useContext } from 'react';
import { useFormState } from 'react-final-form';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import moment from 'moment';
import commonStyles from 'styles/common.pcss';
import ReturnToChannelsButton from 'pages/NewCampaign/ChannelsBriefsPages/containers/ReturnButton';
import { StepHeading, StepLayout } from 'pages/NewCampaign/components';
import {
  BudgetWidget,
  EmulatorLayout,
  FieldsWidthWrapper,
  MessageRemainingLength,
} from 'pages/NewCampaign/ChannelsBriefsPages/components';
import { FFMultiplePhoneNumbersInput, FFRadioBoxGroup, FFTextArea, FFTimeSlider } from 'components/fields';
import FormFieldLabel from 'components/forms/FormFieldLabel';
import { CHANNEL_STUB_PUSH } from 'constants/index';
import {
  ORDER_SENDING_FIELD,
  ORDER_TARGET_ACTION,
  ORDER_MESSAGE_FIELD,
  PUSH_MESSAGE_MAX_LENGTH,
  ORDER_SERVICES_FIELD, ORDER_START_DATE_FIELD, ORDER_FINISH_DATE_FIELD,
} from 'store/NewCampaign/channels/constants';
import { StoresContext } from 'store/mobx';
import LaunchDates from 'pages/NewCampaign/ChannelsBriefsPages/containers/LaunchDates';
import FFDatePickerSingle from 'pages/NewCampaign/containers/FFDatePickerSingle';
import { Preloader } from 'components/common';

import { DateValidatorsContext } from '../../../NewCampaign/ChannelsBriefsPages/hooks/channelsContext';
import TariffInfoLink from '../../../NewCampaign/ChannelsBriefsPages/components/TariffInfoLink';
import TotalOrderInfoPush from '../TotalOrderInfoPush';
import { PUSH_TARGET_ACTIONS } from '../../constants';
import PushAndroid from './components/PushAndroid';
import WebsiteAddressFieldContainer from './containers/WebsiteAddressFieldSms';
import { useNormalizedPushFields } from './hooks';
import styles from './styles.pcss';

const cx = classNames.bind(commonStyles);

function PushOrderFormBody() {
  const { NewCampaign, Common, WebsAndPhonesTaxons } = useContext(StoresContext);
  const {
    values: { [ORDER_TARGET_ACTION]: targetActionType, [ORDER_MESSAGE_FIELD]: message },
  } = useFormState();
  const { countMinStartDate } = useContext(DateValidatorsContext);
  const { name } = Common.getChannelInfoByUid(NewCampaign.currentCampaign.channel_uid);
  const { targetAction, testCtns, timeSending, text, date, additionalInfo } = useNormalizedPushFields();
  return (
    <Fragment>
      <StepLayout isStretched className={cx('label-group-marg')}>
        <ReturnToChannelsButton />
        <StepHeading
          title={name}
          className={cx('marb-m')}
        />

        <TariffInfoLink
          href="https://static.beeline.ru/upload/images/marketing/price_sms.pdf"
          afterLinkText="(PDF, 113 KБ)"
          iconSlug="pdf"
          className={cx('marb-l')}
        />

        {NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_PUSH) &&
          NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_PUSH)?.moderation_comment &&
          <div className={styles.moderationComment}>
            <div className={styles.titleError}>В запуске кампании отказано по следующей причине:</div>
            <div className={styles.item}>{NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_PUSH)?.moderation_comment}</div>
          </div>
        }

        <BudgetWidget
          isDisabled={
            NewCampaign.currentCampaign?.currentOrder?.is_editable &&
            NewCampaign.currentCampaign.status_id !== 5 &&
            NewCampaign.currentCampaign?.currentOrder?.status_id === 7
          }
          isOpeningForbidden
          channelType={CHANNEL_STUB_PUSH}
          className={cx('marb-xl')}
        />


        {WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' &&
          <LaunchDates
            className={cx('marb-m')}
            title={date.title}
            tooltip={date.tooltip}
            startLabel={date.date_start}
            endLabel={date.date_end}
          /> ||
          <div className={styles.singleDateHolder}>
            <div>
              <FormFieldLabel
                isBold
                className={cx('label-group-marg')}
                tooltip={date.tooltip}
              >
                {date.title}
              </FormFieldLabel>
            </div>
            <div className={styles.label}>Старт</div>
            <div className={styles.row}>
              <FFDatePickerSingle
                name={ORDER_START_DATE_FIELD}
                noBorder
                keepErrorIndent={false}
                startDate={countMinStartDate()}
                holidays={NewCampaign.ordersHolidays?.push || {}}
                placeholder="дд.мм.гггг"
              />
              {
                NewCampaign.endDateLoading &&
                <div className={styles.counterHolder}>
                  <Preloader size={25} className={styles.preloader}/>
                  Идет подсчет примерной даты завершения рассылки, это займет до 30 сек.
                </div>
              }

              {
              NewCampaign.currentCampaign?.currentOrder[ORDER_START_DATE_FIELD] &&
              !NewCampaign.endDateLoading &&
              <div className={styles.estimationHolder}>
                Примерная дата завершения {moment(NewCampaign.currentCampaign.currentOrder[ORDER_FINISH_DATE_FIELD])?.format('DD.MM.YYYY')}
              </div>
            }
            </div>
          </div>
          }
        <FieldsWidthWrapper>
          {WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' && (
            <>
              <FormFieldLabel isBold className={cx('marb-xxxs')}>
                {timeSending.title}
              </FormFieldLabel>

              <FFTimeSlider name={ORDER_SENDING_FIELD} className={cx('marb-m')} />
            </>
          )}
        </FieldsWidthWrapper>
      </StepLayout>

      <StepLayout isStretched className={cx('label-group-marg')}>
        <FormFieldLabel tooltip={targetAction.tooltip} isBold className={cx('marb-xxxs')}>
          {targetAction.label}
        </FormFieldLabel>
        <FFRadioBoxGroup
          defaultValue={targetAction.options[0].value}
          options={targetAction.options}
          name={ORDER_TARGET_ACTION}
        />

        <EmulatorLayout
          message={message || undefined}
          emulatorType={EmulatorLayout.types.notification}
          className={cx('mart-s')}
        >
          <FieldsWidthWrapper className={cx('mart-xxl')}>
            {targetActionType === PUSH_TARGET_ACTIONS.FOLLOW_LINK ? (
              <WebsiteAddressFieldContainer className={cx('marb-m')} />
            ) : (
              <PushAndroid />
            )}

            <FormFieldLabel isBold className={cx('marb-xxxs')}>
              {text.title}
            </FormFieldLabel>

            <FFTextArea name={ORDER_MESSAGE_FIELD} keepErrorIndent={false} placeholder={text.field} />

            <MessageRemainingLength
              limit={PUSH_MESSAGE_MAX_LENGTH}
              currentLength={message ? message.length : null}
              className={cx('marb-xxs')}
            />
          </FieldsWidthWrapper>
        </EmulatorLayout>
      </StepLayout>

      <StepLayout isStretched className={cx('label-group-marg', 'padb-m')}>
        <FieldsWidthWrapper isMax>
          <FormFieldLabel
            isBold
            tooltip={testCtns.tooltip}
            className={cx('label-group-marg', 'mart-m')}
          >
            {testCtns.label}
          </FormFieldLabel>
          <FFMultiplePhoneNumbersInput
            buttonText={testCtns.buttonText}
            buttonIcon={testCtns.buttonIcon}
            tooltip={testCtns.tooltip}
            placeholder={testCtns.placeholder}
            name={testCtns.id}
            maxCount={5}
            keepErrorIndent={false}
          />
        </FieldsWidthWrapper>
      </StepLayout>

      <StepLayout isStretched>
        <FieldsWidthWrapper isMax className={cx('marb-xxxs', 'mart-m')}>
          <FormFieldLabel isBold className={cx('marb-xxxs')}>
            {additionalInfo.label}
          </FormFieldLabel>
          <FFTextArea
            placeholder={additionalInfo.placeholder}
            name={ORDER_SERVICES_FIELD}
            keepErrorIndent={false}
            className={cx('marb-m')}
          />
        </FieldsWidthWrapper>
      </StepLayout>

      <TotalOrderInfoPush />
    </Fragment>
  );
}

export default observer(PushOrderFormBody);
