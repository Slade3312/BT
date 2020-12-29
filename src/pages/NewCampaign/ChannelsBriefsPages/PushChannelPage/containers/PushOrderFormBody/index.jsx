import React, { Fragment, useContext } from 'react';
import { useFormState } from 'react-final-form';
import classNames from 'classnames/bind';
import { useSelector } from 'react-redux';
import commonStyles from 'styles/common.pcss';
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
  getBriefMainTipsDescription,
  getBriefTitle,
  getCampaignBriefsMap,
} from 'store/common/templates/newCampaign/briefs-selectors';
import {
  ORDER_SENDING_FIELD,
  ORDER_TARGET_ACTION,
  ORDER_MESSAGE_FIELD,
  PUSH_MESSAGE_MAX_LENGTH,
  ORDER_SERVICES_FIELD,
} from 'store/NewCampaign/channels/constants';
import { StoresContext } from 'store/mobx';
import LaunchDates from 'pages/NewCampaign/ChannelsBriefsPages/containers/LaunchDates';
import TotalOrderInfoPush from '../TotalOrderInfoPush';
import { PUSH_TARGET_ACTIONS } from '../../constants';
import TariffInfoLink from '../../../components/TariffInfoLink';
import ReturnToChannelsButton from '../../../containers/ReturnButton';
import PushAndroid from './components/PushAndroid';
import WebsiteAddressFieldContainer from './containers/WebsiteAddressFieldSms';
import { useRestrictedAudience, useNormalizedPushFields } from './hooks';
import styles from './styles.pcss';


const cx = classNames.bind(commonStyles);

export default function PushOrderFormBody() {
  const { NewCampaign } = useContext(StoresContext);
  const {
    values: { [ORDER_TARGET_ACTION]: targetActionType, [ORDER_MESSAGE_FIELD]: message },
  } = useFormState();

  const template = useSelector(getCampaignBriefsMap)[CHANNEL_STUB_PUSH];
  const title = getBriefTitle(template);
  const mainTipsDescription = getBriefMainTipsDescription(template);

  const handleTargetAction = useRestrictedAudience(targetActionType);

  const { targetAction, testCtns, timeSending, text, date } = useNormalizedPushFields();

  return (
    <Fragment>
      <StepLayout isStretched className={cx('label-group-marg')}>

        {NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_PUSH)?.status_id === 0 &&
          <ReturnToChannelsButton />
        }

        <StepHeading
          title={title}
          description={NewCampaign.getOrdersCurrentCampaign(CHANNEL_STUB_PUSH)?.moderation_comment?.length
            ? ''
            : mainTipsDescription
          }
          className={cx('marb-s')}
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
          }isOpeningForbidden
          channelType={CHANNEL_STUB_PUSH}
          className={cx('marb-xl')}
        />

        <FieldsWidthWrapper>
          <LaunchDates
            className={cx('marb-m')}
            title={date.title}
            tooltip={date.tooltip}
            startLabel={date.date_start}
            endLabel={date.date_end}
          />

          <FormFieldLabel isBold className={cx('marb-xxxs')}>
            {timeSending.title}
          </FormFieldLabel>
          <FFTimeSlider name={ORDER_SENDING_FIELD} className={cx('marb-m')} />
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
          onChange={handleTargetAction}
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

      <TotalOrderInfoPush />
    </Fragment>
  );
}
