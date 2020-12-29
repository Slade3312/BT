import React, { Fragment, useMemo, useContext } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { useFormState } from 'react-final-form';
import commonStyles from 'styles/common.pcss';
import FormFieldLabel from 'components/forms/FormFieldLabel';
import ReturnToChannelsButton from 'pages/NewCampaign/ChannelsBriefsPages/containers/ReturnButton';
import { StoresContext } from 'store/mobx';
import { Preloader, Tooltip } from 'components/common';
import { FeedbackBanner } from 'widgets';

import {
  ORDER_MESSAGE_FIELD,
  ORDER_SENDER_NAME_FIELD,
  ORDER_SENDING_FIELD,
  SMS_MESSAGE_MAX_LENGTH,
  ORDER_SERVICES_FIELD,
  ORDER_FILES_FIELD,
  ORDER_TEST_NUMBERS_FIELD,
  ORDER_START_DATE_FIELD, ORDER_FINISH_DATE_FIELD,
} from 'store/NewCampaign/channels/constants';

import {
  FFMultiplePhoneNumbersInput,
  FFTimeSlider,
  FFTextInput,
  FFTextArea,
  FFContentEditableLinks,
} from 'components/fields';
import { CHANNEL_STUB_SMS } from 'constants/index';
import { StepLayout, StepHeading } from 'pages/NewCampaign/components';
import { convertEmulatorMessage } from 'pages/NewCampaign/utils';
import LaunchDates from 'pages/NewCampaign/ChannelsBriefsPages/containers/LaunchDates';
import OnlineGeo from 'pages/NewCampaign/ChannelsBriefsPages/containers/OnlineGeo/OnlineGeo';
import { EmulatorLayout, FieldsWidthWrapper, InfoText, MessageRemainingLength } from 'pages/NewCampaign/ChannelsBriefsPages/components';

import TariffInfoLink from '../../../NewCampaign/ChannelsBriefsPages/components/TariffInfoLink';
import FFMultiFileChannelUploader from '../FFMultiFileChannelUploader';
import TotalOrderInfoSms from '../TotalOrderInfoSms';
import FFDatePickerSingle from '../../../NewCampaign/containers/FFDatePickerSingle';
import { DateValidatorsContext } from '../../../NewCampaign/ChannelsBriefsPages/hooks/channelsContext';
import SmsBudget from '../../components/SmsBudget';
import styles from './styles.pcss';


const cx = classNames.bind({ ...commonStyles, ...styles });

export const SmsOrderFormBody = observer(() => {
  const { UserInfo, NewCampaign, Templates, Common, WebsAndPhonesTaxons } = useContext(StoresContext);
  const {
    values: { [ORDER_MESSAGE_FIELD]: message, [ORDER_SENDER_NAME_FIELD]: senderName },
  } = useFormState();
  const {
    files = [],
    testCtns = '',
    timeSending = '',
    nameSender = '',
    text = '',
    date = '',
    additionalInfo = '',
    onlineGeo = [],
  } = Templates.getNewCampaignTemplate('BriefOrderSms').form_order; // smsBrief;
  const { countMinStartDate } = useContext(DateValidatorsContext);
  const emulatorText = useMemo(() => convertEmulatorMessage(message), [message]);
  const emulatorTextLength = emulatorText && emulatorText.length;

  return (
    <Fragment>
      <StepLayout isStretched className={cx('label-group-marg')}>

        {NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_SMS)?.status_id === 0 &&
          <ReturnToChannelsButton />
        }

        <StepHeading
          title={Common.getChannelInfoByUid(NewCampaign.currentCampaign.channel_uid).name}
          className={cx('marb-m')}
          titleClassName={cx('title')}
        />

        <TariffInfoLink
          href="https://static.beeline.ru/upload/images/marketing/price_sms.pdf"
          afterLinkText="(PDF, 113 KБ)"
          iconSlug="pdf"
        />

        {NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_SMS) &&
        NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_SMS)?.moderation_comment &&
          <div className={styles.moderationComment}>
            <div className={styles.titleError}>В запуске кампании отказано по следующей причине:</div>
            <div className={styles.item}>{NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_SMS).moderation_comment}</div>
          </div>
        }

      </StepLayout>
      <SmsBudget />
      {
        NewCampaign.currentCampaign.audience !== 0 &&
          <>
            <StepLayout isStretched className={cx('label-group-marg')}>
              {
                WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' &&
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
                holidays={NewCampaign.ordersHolidays?.sms || {}}
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

              {WebsAndPhonesTaxons.webSitesOnOfLine === 'offline' &&
              <FieldsWidthWrapper>
                <FormFieldLabel isBold className={cx('marb-xxxs')}>
                  {timeSending.title}
                </FormFieldLabel>

                <FFTimeSlider name={ORDER_SENDING_FIELD} className={cx('marb-m')} />
              </FieldsWidthWrapper>
              }

              <OnlineGeo templates={onlineGeo} />

            </StepLayout>

            <StepLayout className={cx('label-group-marg')}>
              <EmulatorLayout
                message={emulatorText}
                senderName={senderName || undefined}
                emulatorType={EmulatorLayout.types.messenger}
              >
                <FieldsWidthWrapper className={cx('mart-l')}>
                  <FormFieldLabel isBold className={cx('marb-xxxs')}>
                    {nameSender.name}
                    {UserInfo?.data?.company?.inn && UserInfo?.data?.company?.self_employed === true &&
                    <span>: {senderName}<Tooltip>Это поле заполняется автоматически. Его нельзя отредактировать.</Tooltip></span>
                    }
                  </FormFieldLabel>
                  {
                    !(UserInfo?.data?.company?.inn && UserInfo?.data?.company?.self_employed === true) &&
                    <>
                      <FFTextInput
                        name={ORDER_SENDER_NAME_FIELD}
                        placeholder={nameSender.field}
                        keepErrorIndent={false}
                      />
                      <InfoText className={cx('nameSenderInfo', 'marb-m')}>{nameSender.infoText}</InfoText>
                    </>
                  }
                  <FormFieldLabel isBold className={cx('label-group-marg')} tooltip={files.tooltip}>
                    {files.label}
                  </FormFieldLabel>
                  <FFMultiFileChannelUploader
                    accept=".jpg,.jpeg,.pdf,.png"
                    name={ORDER_FILES_FIELD}
                    buttonNameWithoutFiles={files.buttonNameWithoutFiles}
                    buttonNameWithFiles={files.buttonNameWithoutFiles}
                    iconButton={files.iconButton}
                    iconFile={files.iconFile}
                    keepErrorIndent={false}
                    className={cx('marb-m')}
                  />

                  <div className={cx('marb-xl')}>
                    <FormFieldLabel isBold className={cx('marb-xxxs')}>
                      {text.title}
                    </FormFieldLabel>

                    <FFContentEditableLinks
                      name={ORDER_MESSAGE_FIELD}
                      keepErrorIndent={false}
                      placeholder={text.field}
                    />

                    <MessageRemainingLength
                      limit={SMS_MESSAGE_MAX_LENGTH}
                      currentLength={emulatorTextLength}
                      className={cx('marb-xxs')}
                    />

                  </div>
                </FieldsWidthWrapper>
              </EmulatorLayout>
            </StepLayout>

            <StepLayout className={cx('label-group-marg', 'padb-m')}>
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
                name={ORDER_TEST_NUMBERS_FIELD}
                maxCount={5}
                keepErrorIndent={false}
              />
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

            <TotalOrderInfoSms emulatorText={emulatorText} />

            <FeedbackBanner className={cx('mart-s')} />
          </> || null
      }
    </Fragment>
  );
});
