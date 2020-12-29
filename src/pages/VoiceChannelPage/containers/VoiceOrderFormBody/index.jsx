import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import { observer } from 'mobx-react';
import commonStyles from 'styles/common.pcss';

import { ORDER_COMMENT_FIELD } from 'store/NewCampaign/channels/constants';
import ReturnToChannelsButton from 'pages/NewCampaign/ChannelsBriefsPages/containers/ReturnButton';

import { CHANNEL_STUB_VOICE } from 'constants/index';
import { StepLayout, StepHeading } from 'pages/NewCampaign/components';
import { FormFieldLabel } from 'components/forms';
import { FFTextArea } from 'components/fields';
import LaunchDates from 'pages/NewCampaign/ChannelsBriefsPages/containers/LaunchDates';

import { FieldsWidthWrapper } from 'pages/NewCampaign/ChannelsBriefsPages/components/index';

import { useVoiceChannelCalculatedInfo } from 'pages/NewCampaign/ChannelsBriefsPages/VoiceChannelPage/hooks/use-voice-calculated-info';
import { StoresContext } from 'store/mobx';
import TotalOrderInfoVoice from '../TotalOrderInfoVoice';
import ConnectionTypeBlock from '../../components/ConnectionTypeBlock/ConnectionTypeBlock';
import VoiceBudgetWidget from '../VoiceBudgetWidget/VoiceBudgetWidget';

const cx = classNames.bind(commonStyles);

function VoiceOrderFormBody() {
  const { Templates, Common } = useContext(StoresContext);
  const { name } = Common.getChannelInfoByUid(CHANNEL_STUB_VOICE);
  const { date, comment } = Templates.getNewCampaignTemplate('BriefOrderVoice').form_order;
  const { connectionTypes } = useVoiceChannelCalculatedInfo();
  const mainTipsDescription = Templates.getNewCampaignTemplate('BriefOrderVoice').mainTipsDescription;

  return (
    <>
      <StepLayout isStretched>

        <ReturnToChannelsButton />

        <StepHeading
          title={name}
          description={mainTipsDescription}
          className={cx('marb-m', 'stepContentWidth')}
        />

        <ConnectionTypeBlock connectionTypes={connectionTypes} />

        <VoiceBudgetWidget channelType={CHANNEL_STUB_VOICE} className={cx('mart-l')} />

        <LaunchDates
          className={cx('marb-m', 'mart-l')}
          title={date.title}
          tooltip={date.tooltip}
          startLabel={date.date_start}
          endLabel={date.date_end}
          infoText={date.info_text}
        />

        <FieldsWidthWrapper isMiddle>
          <FormFieldLabel isBold className={cx('marb-xxxs')}>
            {comment.title}
          </FormFieldLabel>

          <FFTextArea
            name={ORDER_COMMENT_FIELD}
            maxLength={200}
            placeholder={comment.placeholder}
            keepErrorIndent={false}
            className={cx('marb-m')}
          />
        </FieldsWidthWrapper>
      </StepLayout>

      <TotalOrderInfoVoice />
    </>
  );
}

export default observer(VoiceOrderFormBody);
