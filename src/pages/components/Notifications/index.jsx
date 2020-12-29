import React from 'react';
import { observer } from 'mobx-react';
import { PortalWrapper } from 'components/helpers';
import NotificationsList from './NotificationsList';

function Notifications() {
  return (
    <PortalWrapper>
      <NotificationsList />
    </PortalWrapper>
  );
}

export default observer(Notifications);
