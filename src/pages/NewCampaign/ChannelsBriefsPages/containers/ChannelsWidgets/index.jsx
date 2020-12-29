import React, { useContext } from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { ChannelContext } from 'store/NewCampaign/channels/context';
import { getChannelsWidgetsCardsItems } from 'store/common/templates/newCampaign/selectors';
import {
  CHANNEL_STUB_INTERNET,
  CHANNEL_STUB_PUSH,
  CHANNEL_STUB_SMS,
  CHANNEL_STUB_TARGET_INTERNET,
  CHANNEL_STUB_VOICE,
} from 'constants/index';
import { StoresContext } from 'store/mobx';
import CurrentOrderForm from '../../components/CurrentOrderForm';
import LegacyChannelWidget from '../ChannelWidget/LegacyChannelWidget';
import ChannelInternetWidget from '../ChannelInternetWidget';
import VoiceChannelWidget from '../ChannelWidget/VoiceChannelWidget';
import ChannelTargetInternetWidget from '../ChannelTargetInternetWidget';
import TargetInternetWrapper from './containers/TargetInternetWrapper';
import styles from './styles.pcss';


function ChannelsWidgets({ className }) {
  const channels = useSelector(getChannelsWidgetsCardsItems);
  const { NewCampaign } = useContext(StoresContext);
  const isShow = NewCampaign.getOrdersCurrentCampaign;
  return (
    <div className={classNames(styles.row, className)}>
      {channels.map(({ channel_uid: channelId }) => (
        <ChannelContext.Provider value={channelId} key={channelId}>
          {isShow(channelId)?.is_editable &&
            <CurrentOrderForm className={styles.item} channelType={channelId}>
              {channelId === CHANNEL_STUB_SMS &&
              <LegacyChannelWidget channelType={CHANNEL_STUB_SMS}/>
              }
              {channelId === CHANNEL_STUB_VOICE &&
              <VoiceChannelWidget/>
              }
              {channelId === CHANNEL_STUB_INTERNET &&
              <ChannelInternetWidget/>
              }
              {channelId === CHANNEL_STUB_PUSH &&
              <LegacyChannelWidget channelType={CHANNEL_STUB_PUSH}/>
              }
              {channelId === CHANNEL_STUB_TARGET_INTERNET &&
              <TargetInternetWrapper><ChannelTargetInternetWidget/></TargetInternetWrapper>
              }
            </CurrentOrderForm>
          }
        </ChannelContext.Provider>
      ))}
    </div>
  );
}

ChannelsWidgets.propTypes = {
  className: PropTypes.string,
};

export default observer(ChannelsWidgets);
