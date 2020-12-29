import React from 'react';
import { useDispatch } from 'react-redux';
import { storiesOf } from '@storybook/react';

import { Description } from 'components/storybook';
import { SET_PUSH_ANDROID_NOTIFICATION_DATA } from 'store/notifications/constants';
import { pushNotification } from 'store/notifications/actions';
import { setCommonConstants } from 'store/common/commonConstants/actions';
import NotificationsList from './NotificationsList';

const Notifications = () => {
  const dispatch = useDispatch();

  dispatch(setCommonConstants({ NOTIFICATION_SHOW_TIME: 3 }));

  const handleNotifyShowing = () => {
    dispatch(pushNotification(
      SET_PUSH_ANDROID_NOTIFICATION_DATA,
      { audience: 900 },
    ));
  };

  return (
    <React.Fragment>
      <Description>NotificationsList: </Description>
      <button type="button" onClick={handleNotifyShowing}>Показать оповещение</button>

      <NotificationsList />
    </React.Fragment>
  );
};

storiesOf('Notifications', module)
  .add('Notifications', () => <Notifications />);
