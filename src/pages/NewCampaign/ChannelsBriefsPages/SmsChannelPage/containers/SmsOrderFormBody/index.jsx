import React, { Fragment, useMemo, useContext } from 'react';
import { useSelector } from 'react-redux';
import { observer } from 'mobx-react';
import classNames from 'classnames/bind';
import { useFormState } from 'react-final-form';
import commonStyles from 'styles/common.pcss';
import FormFieldLabel from 'components/forms/FormFieldLabel';
import { StoresContext } from 'store/mobx';
import { Tooltip } from 'components/common';

import { FeedbackBanner } from 'widgets';

import {
  ORDER_MESSAGE_FIELD,
  ORDER_SENDER_NAME_FIELD,
  ORDER_SENDING_FIELD,
  SMS_MESSAGE_MAX_LENGTH,
  ORDER_SERVICES_FIELD,
  ORDER_FILES_FIELD,
  ORDER_TEST_NUMBERS_FIELD,
} from 'store/NewCampaign/channels/constants';

import {
  FFMultiplePhoneNumbersInput,
  FFTimeSlider,
  FFTextInput,
  FFTextArea,
  FFContentEditableLinks,
} from 'components/fields';

import {
  getBriefMainTipsDescription,
  getBriefTitle,
  getSmsBriefFormOrder,
  getCampaignBriefsMap,
} from 'store/common/templates/newCampaign/briefs-selectors';
import { CHANNEL_STUB_PUSH, CHANNEL_STUB_SMS } from 'constants/index';
import { StepLayout, StepHeading } from 'pages/NewCampaign/components';
import { convertEmulatorMessage } from 'pages/NewCampaign/utils';
import LaunchDates from 'pages/NewCampaign/ChannelsBriefsPages/containers/LaunchDates';
import OnlineGeo from 'pages/NewCampaign/ChannelsBriefsPages/containers/OnlineGeo/OnlineGeo';
import BudgetWidget from '../../../components/BudgetWidget';
import { EmulatorLayout, FieldsWidthWrapper, InfoText, MessageRemainingLength } from '../../../components';
import FFMultiFileChannelUploader from '../FFMultiFileChannelUploader';
import TotalOrderInfoSms from '../TotalOrderInfoSms';
import TariffInfoLink from '../../../components/TariffInfoLink';
import ReturnToChannelsButton from '../../../containers/ReturnButton';
import styles from './styles.pcss';

const cx = classNames.bind({ ...commonStyles, ...styles });

export const SmsOrderFormBody = observer(() => {
  const { UserInfo, NewCampaign } = useContext(StoresContext);
  const template = useSelector(getCampaignBriefsMap)[CHANNEL_STUB_SMS];
  const title = getBriefTitle(template);
  const mainTipsDescription = getBriefMainTipsDescription(template);
  const smsBrief = useSelector(getSmsBriefFormOrder);

  const {
    values: { [ORDER_MESSAGE_FIELD]: message, [ORDER_SENDER_NAME_FIELD]: senderName },
  } = useFormState();
  const { files, testCtns, timeSending, nameSender, text, date, onlineGeo } = smsBrief;
  const emulatorText = useMemo(() => convertEmulatorMessage(message), [message]);
  const emulatorTextLength = emulatorText && emulatorText.length;
  return (
    <Fragment>
      <StepLayout isStretched className={cx('label-group-marg')}>

        {NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_SMS)?.status_id === 0 &&
          <ReturnToChannelsButton />
        }

        <StepHeading
          title={title}
          description={NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_SMS)?.moderation_comment?.length
            ? ''
            : mainTipsDescription
          }
          className={cx('marb-xs')}
          titleClassName={cx('title')}
        />

        <TariffInfoLink
          href="https://static.beeline.ru/upload/images/marketing/price_sms.pdf"
          afterLinkText="(PDF, 113 KБ)"
          iconSlug="pdf"
          className={cx('marb-l')}
        />

        {NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_SMS) &&
        NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_SMS)?.moderation_comment &&
          <div className={styles.moderationComment}>
            <div className={styles.titleError}>В запуске кампании отказано по следующей причине:</div>
            <div className={styles.item}>{NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_SMS).moderation_comment}</div>
          </div>
        }

        <BudgetWidget
          isDisabled={
            NewCampaign.currentCampaign?.currentOrder?.is_editable &&
            NewCampaign.currentCampaign.status_id !== 5 &&
            NewCampaign.currentCampaign?.currentOrder?.status_id === 7
          }
          channelType={CHANNEL_STUB_SMS}
          className={cx('marb-xl')}
        />

        <LaunchDates
          className={cx('marb-m')}
          title={date.title}
          tooltip={date.tooltip}
          startLabel={date.date_start}
          endLabel={date.date_end}
        />

        <FieldsWidthWrapper>
          <FormFieldLabel isBold className={cx('marb-xxxs')}>
            {timeSending.title}
          </FormFieldLabel>
          <FFTimeSlider name={ORDER_SENDING_FIELD} className={cx('marb-m')} />
        </FieldsWidthWrapper>

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
              {
              UserInfo?.data?.company?.inn && UserInfo?.data?.company?.self_employed === true &&
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
                <InfoText className={cx('marb-m')}>{nameSender.infoText}</InfoText>
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
            Дополнительная информация
          </FormFieldLabel>
          <FFTextArea
            placeholder="Укажите дополнительную информацию по таргетингу"
            name={ORDER_SERVICES_FIELD}
            keepErrorIndent={false}
            className={cx('marb-m')}
          />
        </FieldsWidthWrapper>
      </StepLayout>

      <TotalOrderInfoSms emulatorText={emulatorText} />

      <FeedbackBanner className={cx('mart-s')} />
    </Fragment>
  );
});
