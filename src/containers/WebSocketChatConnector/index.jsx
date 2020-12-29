import { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import Cookies from 'js-cookie';
import { WebsocketConnector } from 'modules';
import { StoresContext } from 'store/mobx';

function WebSocketChatConnector({
  onOpen = () => {},
  onTinderChatOpen = () => {},
  onInit = () => {},
  onTinderChatInit = () => {},
  onError = () => {},
  onTinderChatError = () => {},
  onClose = () => {},
  onTinderChatClose = () => {},
  onPreReconnect = () => {},
  onTinderChatPreReconnect = () => {},
  onMessage = () => {},
  onTinderChatMessage = () => {},
  onReconnectLimitReached = () => {},
  onTinderChatReconnectLimitReached = () => {},
  children,
}) {
  const { Chat, TinderChat, UserInfo } = useContext(StoresContext);
  // dont forget that we use hooks and must update all websocket callbacks on every react component rerender
  // to update onReceiveMessage context (refs or other state props that used inside)
  // but must not open new websocket connection every time
  useEffect(() => {
    const handleError = (data) => {
      onError(data);
      onTinderChatError(data);
    };

    const handleMessage = (data) => {
      if (data.method === 'new_company_message') {
        onTinderChatMessage(data);
        return;
      }

      onMessage(data);
    };

    const handleClose = (data) => {
      onClose(data);
      onTinderChatClose(data);
    };

    const handleOpen = (data) => {
      onOpen(data);
      onTinderChatOpen(data);
    };

    const handleInit = (data) => {
      onInit(data);
      onTinderChatInit(data);
    };

    const handlePreReconnect = (data) => {
      onPreReconnect(data);
      onTinderChatPreReconnect(data);
    };

    const handlers = {
      onError: handleError,
      onMessage: handleMessage,
      onClose: handleClose,
      onOpen: handleOpen,
      onInit: handleInit,
      onPreReconnect: handlePreReconnect,
      onReconnectLimitReached: handleReconnectLimitReached,
    };

    const handleReconnectLimitReached = (data) => {
      onReconnectLimitReached(data);
      onTinderChatReconnectLimitReached(data);
    };

    if (!Chat.webSocketConnector && !TinderChat.webSocketConnector) {
      Chat.set('isConnecting', true);
      TinderChat.set('isConnecting', true);

      /* back-end requirements */
      const protocolProps =
        window.location.host !== UserInfo.data.ws_host
          ? { protocols: Cookies.get('marketeco_chatsession') }
          : {};

      const connector = new WebsocketConnector({
        url: `${UserInfo.data.ws_host}/chat/ws`,
        logName: 'Chat',
        ...protocolProps,
        ...handlers,
      });
      Chat.set('webSocketConnector', connector);
      TinderChat.set('webSocketConnector', connector);
    } else {
      Chat.webSocketConnector.updateCallbacks(handlers);
      TinderChat.webSocketConnector.updateCallbacks(handlers);
    }
  });

  return children;
}

WebSocketChatConnector.propTypes = {
  onReceiveMessage: PropTypes.func,
  onListScrollReset: PropTypes.func,
  onOpen: PropTypes.func,
};

export default observer(WebSocketChatConnector);
