import React from 'react';
import PropTypes from 'prop-types';
import {
  CHANNEL_STUB_INTERNET,
  CHANNEL_STUB_PUSH,
  CHANNEL_STUB_SMS,
  CHANNEL_STUB_TARGET_INTERNET,
  CHANNEL_STUB_VOICE,
} from 'constants/index';
import SmsOrderForm from '../../SmsChannelPage/containers/SmsOrderForm';
import InternetOrderForm from '../../InternetChannelPage/containers/InternetOrderForm';
import PushOrderForm from '../../PushChannelPage/containers/PushOrderForm';
import VoiceOrderForm from '../../VoiceChannelPage/containers/VoiceOrderForm';
import AdCreatingForm from '../../SocialChannelPage/containers/AdCreating/AdCreatingForm';

export default function CurrentOrderForm({ channelType, className, children }) {
  switch (channelType) {
    case CHANNEL_STUB_INTERNET:
      return <InternetOrderForm className={className}>{children}</InternetOrderForm>;
    case CHANNEL_STUB_SMS:
      return <SmsOrderForm className={className}>{children}</SmsOrderForm>;
    case CHANNEL_STUB_VOICE:
      return <VoiceOrderForm className={className}>{children}</VoiceOrderForm>;
    case CHANNEL_STUB_PUSH:
      return <PushOrderForm className={className}>{children}</PushOrderForm>;
    case CHANNEL_STUB_TARGET_INTERNET:
      return <AdCreatingForm className={className}>{children}</AdCreatingForm>;
    default:
      throw new Error(`Unable to render form for channel '${channelType}'`);
  }
}

CurrentOrderForm.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  channelType: PropTypes.string,
};
